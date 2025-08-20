import type { BaseParams } from "@/types"

export interface IQuery {
    // fetch balance of an address
    fetchBalance: (params: FetchBalanceParams) => Promise<FetchBalanceResponse>
    // fetch the metadata of a token
    fetchTokenMetadata?: (params: FetchTokenMetadataParams) => Promise<FetchTokenMetadataResponse>
}

export interface FetchBalanceParams {
    // account address
    accountAddress: string
    // token address, in Solana we use mint address instead
    tokenAddress: string
}

export interface FetchBalanceResponse {
    // amount of the token
    amount: number
}


export interface FetchTokenMetadataParams extends BaseParams {
    // token address, in Solana we use mint address instead
    tokenAddress: string
}

export interface FetchTokenMetadataResponse {
    // metadata of the token
    decimals: number
    symbol: string
    name: string
    iconUrl?: string
}