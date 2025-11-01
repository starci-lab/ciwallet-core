import type { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import type { ProtocolId } from "./ProtocolManager"

export interface IAggregator {
    quote: (params: QuoteParams) => Promise<QuoteResponse>
    signAndSendTransaction: (params: SignAndSendTransactionParams) => Promise<SignAndSendTransactionResponse>
}

export interface QuoteParams {
    // if not provide fromTokenAddress, we will use the default token for the chain
    fromTokenAddress?: string
    // if not provide toTokenAddress, we will use the default token for the chain
    toTokenAddress?: string
    fromTokenDecimals: number
    toTokenDecimals: number
    amount: number
    exactIn: boolean
    slippage: number
    fromChainId: ChainId
    toChainId: ChainId
    fromAddress: string
    toAddress: string
    network: Network
    signal?: AbortSignal
}

export interface Route {
    protocol: ProtocolId
    pool: string;
    fee: number
    percent: number;
    routes?: Array<Route>;
}   

export interface RawRoute {
    id: string
    name: string
    imageUrl: string
}

export interface QuoteResponse {
    amountOut: number
    routes: Array<Route>
    rawRoutes?: Array<RawRoute>
    serializedTx: string
}

export interface EvmSerializedTx {
    to: string
    data: string
    value: string
}

export interface SignAndSendTransactionParams {
    // if the protocol return serialized tx via API response, we use this
    serializedTx?: string
    privateKey: string
    rpcs: Array<string>
    fromChainId: ChainId
    toChainId: ChainId
    senderAddress: string
    recipientAddress: string
    network: Network
    signal?: AbortSignal
}

export interface SignAndSendTransactionResponse {
    txHash: string
}