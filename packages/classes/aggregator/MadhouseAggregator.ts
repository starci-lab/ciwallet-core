import { getEvmChainId, toDenomination, toRaw } from "@ciwallet-sdk/utils"
import type {
    IAggregator,
    QuoteParams,
    QuoteResponse,
    Route,
} from "./IAggregator"
import axios, { Axios } from "axios"
import { TokenManager } from "../data"
import type { ProtocolId } from "./ProtocolManager"
import BN from "bn.js"
import SuperJSON from "superjson"

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
                amountIn: toRaw(
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
            amountOut: toDenomination(new BN(amountOut), tokenOutEntity?.decimals),
            routes,
            serializedTx: SuperJSON.stringify(tx),
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
