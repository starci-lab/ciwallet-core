import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum InitPage {
    Launch = "launch",
    CreatePassword = "createPassword",
    Splash = "splash",
}

export interface InitSlice {
    // state of init page
    initPage: InitPage
    // mnemonic
    mnemonic?: string
}

const initialState: InitSlice = {
    initPage: InitPage.Launch,
}

export const initSlice = createSlice({
    name: "init",
    initialState,
    reducers: {
        setInitPage: (state, action: PayloadAction<InitPage>) => {
            state.initPage = action.payload
        },
        setMnemonic: (state, action: PayloadAction<string>) => {
            state.mnemonic = action.payload
        },
    },
})

export const initReducer = initSlice.reducer
export const {
    setInitPage,
    setMnemonic,
} = initSlice.actions

