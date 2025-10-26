import { computeDenomination, computeRaw, getEvmChainId } from "@ciwallet-sdk/utils"
import type {
    EvmSerializedTx,
    IAggregator,
    QuoteParams,
    QuoteResponse,
    Route,
    SignAndSendTransactionResponse,
} from "./IAggregator"
import axios, { Axios } from "axios"
import { TokenManager } from "../data"
import type { ProtocolId } from "./ProtocolManager"
import BN from "bn.js"
import SuperJSON from "superjson"
import type { SignAndSendTransactionParams } from "./IAggregator"
import { ethers } from "ethers"
import { ChainId } from "@ciwallet-sdk/types"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export class MadhouseAggregator implements IAggregator {
    private readonly axiosInstance: Axios
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://prod-api.madhouse.ag",
        })
    }
    async quote(params: QuoteParams): Promise<QuoteResponse> {
        const chainId = getEvmChainId(params.fromChainId, params.network)
        const tokenManager = new TokenManager()
        const tokenInEntity = tokenManager.getTokenById(
            params.fromToken,
        )
        const tokenOutEntity = tokenManager.getTokenById(
            params.toToken,
        )
        const tokenIn = !tokenInEntity?.address
            ? ZERO_ADDRESS
            : tokenInEntity?.address
        const tokenOut = !tokenOutEntity?.address
            ? ZERO_ADDRESS
            : tokenOutEntity?.address
        const {
            data: { routes: madhouseRoutes, amountOut, tx },
        } = await this.axiosInstance.get<SwapResponse>("swap/v1/quote", {
            params: {
                chain: chainId,
                tokenIn,
                tokenOut,
                amountIn: computeRaw(
                    params.amount,
                    tokenInEntity?.decimals
                ).toString(),
                slippage: params.slippage / 100,
                includePoolInfo: true,
                tokenInDecimals: tokenInEntity?.decimals,
                tokenOutDecimals: tokenOutEntity?.decimals,
            },
            signal: params.signal,
        })

        const cleanRoute = (route: MadhouseRoute): Route => {
            return {
                protocol: route.protocol,
                pool: route.pool,
                fee: route.fee,
                percent: route.percent,
                routes: route.routes ? route.routes.map(cleanRoute) : [],
            }
        }
        // we build paths from routes
        const routes: Array<Route> = madhouseRoutes.map(cleanRoute)
        return {
            amountOut: computeDenomination(new BN(amountOut), tokenOutEntity?.decimals).toNumber(),
            routes,
            serializedTx: SuperJSON.stringify(tx),
        }
    }

    async signAndSendTransaction({
        serializedTx,
        privateKey,
        rpcs,
        senderAddress,
        recipientAddress,
        fromChainId,
        toChainId,
        network,
    }: SignAndSendTransactionParams): Promise<SignAndSendTransactionResponse> {
        if (fromChainId !== ChainId.Monad || toChainId !== ChainId.Monad) {
            throw new Error("MadhouseAggregator only supports Monad chain")
        }
        if (senderAddress !== recipientAddress) {
            throw new Error("MadhouseAggregator only supports same address")
        }
        try {
            // we use the first RPC url for the provider
            // later we can update some feature like load balance from multiple RPC urls
            const rpcProvider = new ethers.JsonRpcProvider(
                rpcs[0]
            )
            const wallet = new ethers.Wallet(privateKey, rpcProvider)
            const signer = wallet.connect(rpcProvider)
            const nonce = await rpcProvider.getTransactionCount(senderAddress, "pending")
            const { to, data, value } = SuperJSON.parse<EvmSerializedTx>(
                serializedTx || ""
            )
            if (!to || !data || !value) {
                throw new Error("Invalid transaction data")
            }
            const tx = new ethers.Transaction()
            tx.to = to
            tx.data = data
            tx.value = value
            tx.chainId = BigInt(getEvmChainId(fromChainId, network))
            const feeData = await rpcProvider.getFeeData()
            tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
            tx.maxFeePerGas = feeData.maxFeePerGas
            tx.gasLimit = new BN(1000000).toString()
            tx.nonce = nonce
            const transaction = await signer.sendTransaction(tx)
            const receipt = await rpcProvider.waitForTransaction(transaction.hash)
            if (!receipt) {
                throw new Error("Transaction failed")
            }
            return {
                txHash: receipt.hash,
            }
        } catch (error) {
            throw new Error(`Transaction failed: ${error}`)
        }
    }
}

export interface MadhouseToken {
  address: string;
}

export interface MadhouseRoute {
  pool: string;
  fromToken: MadhouseToken;
  toToken: MadhouseToken;
  percent: number;
  routes: Array<MadhouseRoute>;
  protocol: ProtocolId;
  fee: number;
}

export interface Transaction {
  to: string;
  data: string;
  value: string;
}

export interface SwapResponse {
  tokenIn: MadhouseToken;
  tokenOut: MadhouseToken;
  amountOut: string;
  routes: Array<MadhouseRoute>;
  tx: Transaction;
}
