import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum HomeFunction {
    Portfolio = "portfolio",
    Token = "token",
    Send = "send",
    Receive = "receive",
}

export enum HomeAction {
    Buy = "buy",
    Sell = "sell",
    Swap = "swap",
    Send = "send",
    Receive = "receive",
}

export interface HomeSectionSlice {
    function: HomeFunction;
    portfolioSelectedChainId: ChainId;
    selectedTokenId: TokenId;
    action: HomeAction;
    selectedFromAccountId: string;
}

const initialState: HomeSectionSlice = {
    function: HomeFunction.Portfolio,
    portfolioSelectedChainId: ChainId.Monad,
    selectedTokenId: TokenId.MonadTestnetMon,
    action: HomeAction.Buy,
    selectedFromAccountId: "",
}

export const homeSectionSlice = createSlice({
    name: "homeSection",
    initialState,
    reducers: {
        setHomeFunction: (state, action: PayloadAction<HomeFunction>) => {
            state.function = action.payload
        },
        setPortfolioSelectedChainId: (state, action: PayloadAction<ChainId>) => {
            state.portfolioSelectedChainId = action.payload
        },
        setSelectedTokenId: (state, action: PayloadAction<TokenId>) => {
            state.selectedTokenId = action.payload
        },
        setHomeAction: (state, action: PayloadAction<HomeAction>) => {
            state.action = action.payload
        },
        setSelectedFromAccountId: (state, action: PayloadAction<string>) => {
            state.selectedFromAccountId = action.payload
        },
    },
})

export const { setHomeFunction, setPortfolioSelectedChainId, setSelectedTokenId, setHomeAction, setSelectedFromAccountId } = homeSectionSlice.actions
export const homeSectionReducer = homeSectionSlice.reducer