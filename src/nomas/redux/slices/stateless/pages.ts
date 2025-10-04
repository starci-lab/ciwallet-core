import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface PagesSlice {
    initPage: InitPage;
    swapPage: SwapPage;
    withdrawPage: WithdrawPage;
}

export enum InitPage {
    Launch = "launch",
    CreatePassword = "createPassword",
    Splash = "splash",
}

export enum SwapPage {
    Swap = "swap",
    NomasAggregation = "nomasAggregation",
    SelectToken = "selectToken",
}

export enum WithdrawPage {
    InitWithdraw = "initWithdraw",
    SignTransaction = "signTransaction",
    ProcessTransaction = "processTransaction",
    ResultTransaction = "resultTransaction",
    ChooseTokenTab = "chooseTokenTab",
}

const initialState: PagesSlice = {
    initPage: InitPage.Launch,
    swapPage: SwapPage.Swap,
    withdrawPage: WithdrawPage.InitWithdraw,
}

export const pagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
        setInitPage: (state, action: PayloadAction<InitPage>) => {
            state.initPage = action.payload
        },
        setSwapPage: (state, action: PayloadAction<SwapPage>) => {
            state.swapPage = action.payload
        },
        setWithdrawPage: (state, action: PayloadAction<WithdrawPage>) => {
            state.withdrawPage = action.payload
        },
    },
})

export const pagesReducer = pagesSlice.reducer

export const {
    setInitPage,
    setSwapPage,
    setWithdrawPage,
} = pagesSlice.actions