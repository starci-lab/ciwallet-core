import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum SwapFunctionPage {
    ChooseNetwork = "choose-network",
    SelectToken = "select-token",
    Swap = "swap",
    NomasAggregation = "nomas-aggregation",
}

export interface SwapSectionSlice {
    swapFunctionPage: SwapFunctionPage;
    expandDetails: boolean;
    tokenIn: TokenId;
    tokenOut: TokenId;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
}

const initialState: SwapSectionSlice = {
    swapFunctionPage: SwapFunctionPage.ChooseNetwork,
    expandDetails: false,
    tokenIn: TokenId.MonadTestnetMon,
    tokenOut: TokenId.MonadTestnetMon,
    tokenInChainId: ChainId.Monad,
    tokenOutChainId: ChainId.Monad,
}

export const swapSectionSlice = createSlice({
    name: "swapSection",
    initialState,
    reducers: {
        setSwapFunctionPage: (state, action: PayloadAction<SwapFunctionPage>) => {
            state.swapFunctionPage = action.payload
        },
        setExpandDetails: (state, action: PayloadAction<boolean>) => {
            state.expandDetails = action.payload
        },
        setTokenIn: (state, action: PayloadAction<TokenId>) => {
            state.tokenIn = action.payload
        },
        setTokenOut: (state, action: PayloadAction<TokenId>) => {
            state.tokenOut = action.payload
        },
        setTokenInChainId: (state, action: PayloadAction<ChainId>) => {
            state.tokenInChainId = action.payload
        },
        setTokenOutChainId: (state, action: PayloadAction<ChainId>) => {
            state.tokenOutChainId = action.payload
        },
    },
})

export const { setSwapFunctionPage, setExpandDetails, setTokenIn, setTokenOut, setTokenInChainId, setTokenOutChainId } = swapSectionSlice.actions
export const swapSectionReducer = swapSectionSlice.reducer