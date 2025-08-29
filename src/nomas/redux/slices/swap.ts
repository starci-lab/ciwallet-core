import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SwapSlice {
    progress: number
    expandDetails: boolean
}

const initialState: SwapSlice = {
    progress: 0,
    expandDetails: false,
}

export const swapSlice = createSlice({
    name: "swap",
    initialState,
    reducers: {
        setProgress: (
            state, 
            action: PayloadAction<number>
        ) => {
            state.progress = action.payload
        },
        setExpandDetails: (
            state, 
            action: PayloadAction<boolean>
        ) => {
            state.expandDetails = action.payload
        },
    },
})

export const swapReducer = swapSlice.reducer
export const {
    setProgress,
    setExpandDetails
} = swapSlice.actions
