import type { ChainId, Network } from "@ciwallet-sdk/types"
import type { ProtocolId } from "./ProtocolManager"
import type BN from "bn.js"

export interface ICrossChainAggregator {
    quote: (params: QuoteParams) => Promise<QuoteResponse>
}

export interface QuoteQuery {
    fromToken: string
    toToken: string
    amount: BN
    exactIn: boolean
    fromChainId: ChainId
    toChainId: ChainId
    fromAddress: string
    toAddress: string
    slippage: number
}
export interface QuoteParams {
    query: QuoteQuery,
    network: Network
    signal?: AbortSignal
}

export interface Route {
    protocol: ProtocolId
    pool: string;
    fee: number
    percent: number;
    routes: Array<Route>;
}   

export interface QuoteResponse {
    amountOut: BN
    //routes: Array<Route>
    //serializedTx: string
}

export interface EvmSerializedTx {
    to: string
    data: string
    value: string
}