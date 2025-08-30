

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ProtocolManager } from "@ciwallet-sdk/classes"

export interface ProtocolSlice {
    manager: ProtocolManager
}

const initialState: ProtocolSlice = {
    manager: new ProtocolManager(),
}

export const protocolSlice = createSlice({
    name: "protocols",
    initialState,
    reducers: {
        setProtocolManager: (state, action: PayloadAction<ProtocolManager>) => {
            state.manager = action.payload
        },
    },
})

export const protocolReducer = protocolSlice.reducer
export const {
    setProtocolManager,
} = protocolSlice.actions
