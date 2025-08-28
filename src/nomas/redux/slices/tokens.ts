

import { createSlice } from "@reduxjs/toolkit"
import { TokenManager } from "@ciwallet-sdk/classes"

export interface TokenSlice {
    manager: TokenManager
}

const initialState: TokenSlice = {
    manager: new TokenManager(),
}

export const tokenSlice = createSlice({
    name: "tokens",
    initialState,
    reducers: {
        setTokenManager: (state, action) => {
            state.manager = action.payload
        },
    },
})

export const tokenReducer = tokenSlice.reducer
export const {
    setTokenManager,
} = tokenSlice.actions
