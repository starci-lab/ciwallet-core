import { type AggregatorId } from "@ciwallet-sdk/classes"
import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum TransactionType {
    Withdrawal = "withdrawal",
    Swap = "swap",
    Bridge = "bridge",
    Deposit = "deposit",
}

export type TransactionData = 
{
    type: TransactionType.Swap
    chainId: ChainId
    fromTokenId: TokenId
    toTokenId: TokenId
    fromAddress: string
    toAddress: string
    fromAmount: number
    toAmount: number
    aggregatorId: AggregatorId
    txHash: string
} 
| 
{
    type: TransactionType.Bridge
    fromTokenId: TokenId
    toTokenId: TokenId
    fromChainId: ChainId
    toChainId: ChainId
    fromAddress: string
    toAddress: string
    fromAmount: number
    toAmount: number
    aggregatorId: AggregatorId
    txHash: string
} 
| 
{
    type: TransactionType.Withdrawal
    chainId: ChainId
    fromAddress: string
    toAddress: string
    tokenId: TokenId
    amount: number
    txHash: string
}
| 
{
    type: TransactionType.Deposit
    chainId: ChainId
    tokenId: TokenId
    amount: number
    txHash: string
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
    txHash: string;
    swapSuccess: boolean;
    transactionType: TransactionType;
    searchQuery: string;
}

const initialState: SwapSectionSlice = {
    swapFunctionPage: SwapFunctionPage.Swap,
    expandDetails: false,
    tokenIn: TokenId.MonadTestnetMon,
    tokenOut: TokenId.MonadTestnetMon,
    tokenInChainId: ChainId.Monad,
    tokenOutChainId: ChainId.Monad,
    txHash: "",
    swapSuccess: true,
    transactionType: TransactionType.Swap,
    searchQuery: "",
}

export const swapSlice = createSlice({
    name: "swap",
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
        setTxHash: (state, action: PayloadAction<string>) => {
            state.txHash = action.payload
        },
        setSwapSuccess: (state, action: PayloadAction<boolean>) => {
            state.swapSuccess = action.payload
        },
        setTransactionType: (state, action: PayloadAction<TransactionType>) => {
            state.transactionType = action.payload
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
    },
})

export const { 
    setSwapFunctionPage, 
    setExpandDetails, 
    setTokenIn, 
    setTokenOut, 
    setTokenInChainId, 
    setTokenOutChainId, 
    setTransactionData, 
    setTxHash, 
    setSwapSuccess, 
    setTransactionType,
    setSearchQuery
} = swapSlice.actions
export const swapReducer = swapSlice.reducer