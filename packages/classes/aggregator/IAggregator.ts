import type { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import type { ProtocolId } from "./ProtocolManager"

export interface IAggregator {
    quote: (params: QuoteParams) => Promise<QuoteResponse>
    signAndSendTransaction: (params: SignAndSendTransactionParams) => Promise<SignAndSendTransactionResponse>
}

export interface QuoteParams {
    fromToken: TokenId
    toToken: TokenId
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