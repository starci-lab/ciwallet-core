// an interface to do the data action 

import { ChainId, Network } from "@ciwallet-sdk/types"
// when any wallet builder is created, it will be passed to the wallet kit provider

export interface ITransactionAdapter {
    saveTransaction: (params: SaveTransactionParams) => Promise<void> | void
    getTransactions: (params: GetTransactionsParams) => Promise<GetTransactionsResponse> | GetTransactionsResponse
}

export enum TransactionType {
    Deposit = "deposit",
    Withdraw = "withdraw",
    Swap = "swap",
}

export interface SaveTransactionParams {
    // transaction hash
    txHash: string
    // transaction status
    status: string
    // network
    network: Network
    // chain id
    chainId: ChainId
    // transaction type
    type: TransactionType
}

export interface GetTransactionsParams {
    // network
    network: Network
    // chain id
    chainId: ChainId
    // filter
    filter?: GetTransactionsFilter
}

export interface GetTransactionsFilter {
    // cursor
    cursor: string
    // limit
    limit: number
}

export interface Transaction {
    // transaction hash
    txHash: string
    // transaction type
    type: TransactionType
    // transaction status
    status: string
    // network
    network: Network
    // chain id
    chainId: ChainId
}

export interface GetTransactionsResponse {
    // transactions
    transactions: Array<Transaction>
    // next cursor
    nextCursor: string
}