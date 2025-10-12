import { ChainId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface DepositFunctionSlice {
    selectedChainId: ChainId;
}

const initialState: DepositFunctionSlice = {
    selectedChainId: ChainId.Monad,
}

export const depositFunctionSlice = createSlice({
    name: "depositFunction",
    initialState,
    reducers: {
        setDepositSelectedChainId: (state, action: PayloadAction<ChainId>) => {
            state.selectedChainId = action.payload
        },
    },
})

export const { setDepositSelectedChainId } = depositFunctionSlice.actions
export const depositFunctionReducer = depositFunctionSlice.reducer