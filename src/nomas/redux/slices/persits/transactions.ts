import type { ChainId, Network } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getStorageConfig } from "../../utils"
import { persistReducer } from "redux-persist"

export enum TransactionType {
    Deposit = "deposit",
    Withdraw = "withdraw",
    Swap = "swap",
    Bridge = "bridge",
    Transfer = "transfer",
}

export interface ReduxTransaction {
    txHash: string;
    type: TransactionType;
    status: string;
    network: Network;
    chainId: ChainId;
    // additional data for the transaction
    data: unknown;
}

export interface TransactionsSlice {
    transactions: Array<ReduxTransaction>;
}

const initialState: TransactionsSlice = {
    transactions: [],
}

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<ReduxTransaction>) => {
            state.transactions.push(action.payload)
        },
        addTransactions: (state, action: PayloadAction<Array<ReduxTransaction>>) => {
            state.transactions.push(...action.payload)
        },
    },
})

export const transactionsReducer = persistReducer(getStorageConfig(), transactionsSlice.reducer)
export const {
    addTransaction,
} = transactionsSlice.actions