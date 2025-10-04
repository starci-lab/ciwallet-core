import { createSlice } from "@reduxjs/toolkit"

export enum SwapPageState {
    SelectToken,
    Swap,
    NomasAggregation
}
export interface PagesSlice {
    swapPage: SwapPageState
}

const initialState: PagesSlice = {
    swapPage: SwapPageState.Swap,
}

export const pagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
        setSwapPage: (state, action) => {
            state.swapPage = action.payload
        },
    },
})

export const pagesReducer = pagesSlice.reducer
export const {
    setSwapPage,
} = pagesSlice.actions
