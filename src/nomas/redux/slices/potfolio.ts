

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId } from "@ciwallet-sdk/types"

export interface PotfolioSlice {
    chainId: ChainId
}

const initialState: PotfolioSlice = {
    chainId: ChainId.Monad,
}

export const potfolioSlice = createSlice({
    name: "potfolio",
    initialState,
    reducers: {
        setPotfolioChainId: (state, action: PayloadAction<ChainId>) => {
            state.chainId = action.payload
        },
    },
})

export const potfolioReducer = potfolioSlice.reducer
export const {
    setPotfolioChainId,
} = potfolioSlice.actions
