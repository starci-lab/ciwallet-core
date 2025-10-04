import { createSlice } from "@reduxjs/toolkit"
import { Network } from "@ciwallet-sdk/types"

export interface BaseSlice {
    network: Network
}

const initialState: BaseSlice = {
    network: Network.Testnet,
}

export const baseSlice = createSlice({
    name: "base",
    initialState,
    reducers: {
        setNetwork: (state, action) => {
            state.network = action.payload
        },
    },
})

export const baseReducer = baseSlice.reducer
export const {
    setNetwork,
} = baseSlice.actions
