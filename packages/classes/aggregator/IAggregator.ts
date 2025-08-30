import type { ChainId, Network } from "@ciwallet-sdk/types"
import type { ProtocolId } from "./ProtocolManager"

export interface IAggregator {
    quote: (params: QuoteParams) => Promise<QuoteResponse>
}

export interface QuoteQuery {
    fromToken: string
    toToken: string
    amount: number
    exactIn: boolean
    slippage: number
}
export interface QuoteParams {
    query: QuoteQuery,
    chainId: ChainId
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
    amountOut: number
    routes: Array<Route>
    serializedTx: string
}

export interface EvmSerializedTx {
    to: string
    data: string
    value: string
}