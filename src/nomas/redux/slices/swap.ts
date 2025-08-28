import { ChainId, type Token } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SwapSlice {
    tokenIn?: Token
    tokenOut?: Token
    tokenInChainId?: ChainId
    tokenOutChainId?: ChainId
    isInput: boolean
}

const initialState: SwapSlice = {
    tokenInChainId: ChainId.Monad,
    tokenOutChainId: ChainId.Monad,
    isInput: true,
}

export const swapSlice = createSlice({
    name: "swap",
    initialState,
    reducers: {
        setTokenIn: (
            state, 
            action: PayloadAction<Token>
        ) => {
            state.tokenIn = action.payload
        },
        setTokenOut: (
            state, 
            action: PayloadAction<Token>
        ) => {
            state.tokenOut = action.payload
        },
        setTokenInChainId: (
            state, 
            action: PayloadAction<ChainId>
        ) => {
            state.tokenInChainId = action.payload
        },
        setTokenOutChainId: (
            state, 
            action: PayloadAction<ChainId>
        ) => {
            state.tokenOutChainId = action.payload
        },
        setIsInput: (
            state, 
            action: PayloadAction<boolean>
        ) => {
            state.isInput = action.payload
        },
    },
})

export const swapReducer = swapSlice.reducer
export const {
    setTokenIn,
    setTokenOut,
    setTokenInChainId,
    setTokenOutChainId,
    setIsInput,
} = swapSlice.actions
