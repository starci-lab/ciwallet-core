

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId } from "@ciwallet-sdk/types"

export interface WithdrawSlice {
    chainId: ChainId
}

const initialState: WithdrawSlice = {
    chainId: ChainId.Monad,
}

export const withdrawSlice = createSlice({
    name: "withdraw",
    initialState,
    reducers: {
        setWithdrawChainId: (state, action: PayloadAction<ChainId>) => {
            state.chainId = action.payload
        },
    },
})

export const withdrawReducer = withdrawSlice.reducer
export const {
    setWithdrawChainId,
} = withdrawSlice.actions
