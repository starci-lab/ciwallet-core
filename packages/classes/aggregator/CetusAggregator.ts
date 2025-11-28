import { computeDenomination, computeRaw } from "@ciwallet-sdk/utils"
import type { 
    IAggregator, 
    SignAndSendTransactionResponse, 
    QuoteResponse, 
    QuoteParams, 
    SignAndSendTransactionParams 
} from "./IAggregator"
import { AggregatorClient, type RouterDataV3 } from "@cetusprotocol/aggregator-sdk"
import { SuperJSON } from "@ciwallet-sdk/utils"
import { Transaction } from "@mysten/sui/transactions"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"

export class CetusAggregator implements IAggregator {
    private readonly client: AggregatorClient
    constructor() {
        this.client = new AggregatorClient({})
    }
    async quote({
        fromTokenAddress,
        toTokenAddress,
        amount,
        toTokenDecimals,
        fromTokenDecimals,
        slippage
    }: QuoteParams): Promise<QuoteResponse> {
        try {
            const response = await this.client.findRouters({
                from: fromTokenAddress || "",
                target: toTokenAddress ?? "",
                amount: computeRaw(amount, fromTokenDecimals),
                byAmountIn: true, // true means fix input amount, false means fix output amount
            })
            if (!response) {
                return {
                    success: false,
                    amountOut: 0,
                    routes: [],
                    serializedTx: "",
                }
            }
            const tx: CetusSerializedTx = {
                data: response,
                slippage
            }
            return {
                success: true,
                amountOut: computeDenomination(response.amountOut, toTokenDecimals).toNumber(),
                routes: [],
                serializedTx: SuperJSON.stringify(tx),
            }
        } catch {
            return {
                success: false,
                amountOut: 0,
                routes: [],
                serializedTx: "",
            }
        }
    }
    async signAndSendTransaction({
        serializedTx,
        privateKey,
    }: SignAndSendTransactionParams): Promise<SignAndSendTransactionResponse> {
        const { data, slippage } = SuperJSON.parse<CetusSerializedTx>(serializedTx ?? "")
        const txb = new Transaction()

        await this.client.fastRouterSwap({
            router: data,
            txb,
            slippage,
        })

        const keypair = Ed25519Keypair.fromSecretKey(privateKey)
        const { digest } = await this.client.client.signAndExecuteTransaction({
            transaction: txb,
            signer: keypair,
        })
        return {
            txHash: digest,
        }
    }
}

interface CetusSerializedTx {
    data: RouterDataV3
    slippage: number
}