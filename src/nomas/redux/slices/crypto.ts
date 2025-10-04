

import { createSlice } from "@reduxjs/toolkit"
import { Encryption } from "@ciwallet-sdk/classes"

export interface CryptoSlice {
    encryption: Encryption
}

const initialState: CryptoSlice = {
    encryption: new Encryption(),
}

export const cryptoSlice = createSlice({
    name: "crypto",
    initialState,
    reducers: {
        setCryptoEncryption: (state, action) => {
            state.encryption = action.payload
        },
    },
})

export const cryptoReducer = cryptoSlice.reducer
export const {
    setCryptoEncryption,
} = cryptoSlice.actions
