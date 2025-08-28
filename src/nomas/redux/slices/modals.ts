

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ModalsSlice {
    selectToken: {
        isInput: boolean
    }
}

const initialState: ModalsSlice = {
    selectToken: {
        isInput: false,
    },
}

export const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        setSelectTokenInput: (state, action: PayloadAction<boolean>) => {
            state.selectToken.isInput = action.payload
        },
    },
})

export const modalsReducer = modalsSlice.reducer
export const {
    setSelectTokenInput,
} = modalsSlice.actions
