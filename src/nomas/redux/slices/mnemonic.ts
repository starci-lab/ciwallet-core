import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface MnemonicSlice {
    mnemonic: string | null
}

const initialState: MnemonicSlice = {
    mnemonic: null,
}

export const mnemonicSlice = createSlice({
    name: "mnemonics",
    initialState,
    reducers: {
        setMnemonic: (state, action: PayloadAction<string>) => {
            state.mnemonic = action.payload
        },
    },
})

export const mnemonicReducer = mnemonicSlice.reducer
export const {
    setMnemonic,
} = mnemonicSlice.actions
