import { ChainId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface DepositSectionSlice {
    selectedChainId: ChainId;
}

const initialState: DepositSectionSlice = {
    selectedChainId: ChainId.Monad,
}

export const depositSectionSlice = createSlice({
    name: "depositSection",
    initialState,
    reducers: {
        setDepositSelectedChainId: (state, action: PayloadAction<ChainId>) => {
            state.selectedChainId = action.payload
        },
    },
})

export const { setDepositSelectedChainId } = depositSectionSlice.actions
export const depositSectionReducer = depositSectionSlice.reducer