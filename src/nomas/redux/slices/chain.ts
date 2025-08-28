

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainManager } from "@ciwallet-sdk/classes"

export interface ChainSlice {
    manager: ChainManager
}

const initialState: ChainSlice = {
    manager: new ChainManager(),
}

export const chainSlice = createSlice({
    name: "chains",
    initialState,
    reducers: {
        setChainManager: (state, action: PayloadAction<ChainManager>) => {
            state.manager = action.payload
        },
    },
})

export const chainReducer = chainSlice.reducer
export const {
    setChainManager,
} = chainSlice.actions
