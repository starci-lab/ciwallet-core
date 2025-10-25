import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum TransactionType {
    Withdraw = "withdraw",
    Swap = "swap",
    Bridge = "bridge",
}

export type TransactionData = 
{
    type: TransactionType.Swap
    chainId: ChainId
    fromTokenId: TokenId
    toTokenId: TokenId
    fromAddress: string
    toAddress: string
    amount: number
} 
| 
{
    type: TransactionType.Bridge
    fromTokenId: TokenId
    toTokenId: TokenId
    amount: number
    toAddress: string
} 
| 
{
    type: TransactionType.Withdraw
    chainId: ChainId
    fromAddress: string
    toAddress: string
    tokenId: TokenId
    amount: number
}

export enum SwapFunctionPage {
    ChooseNetwork = "choose-network",
    SelectToken = "select-token",
    TransactionReceipt = "transaction-receipt",
    Swap = "swap",
    NomasAggregation = "nomas-aggregation",
    SlippageConfig = "slippage-config",
}

export interface SwapSectionSlice {
    swapFunctionPage: SwapFunctionPage;
    expandDetails: boolean;
    tokenIn: TokenId;
    tokenOut: TokenId;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
    transactionData?: TransactionData;
}

const initialState: SwapSectionSlice = {
    swapFunctionPage: SwapFunctionPage.TransactionReceipt,
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
        setTransactionData: (state, action: PayloadAction<TransactionData>) => {
            state.transactionData = action.payload
        },
    },
})

export const { setSwapFunctionPage, setExpandDetails, setTokenIn, setTokenOut, setTokenInChainId, setTokenOutChainId, setTransactionData } = swapSectionSlice.actions
export const swapSectionReducer = swapSectionSlice.reducer