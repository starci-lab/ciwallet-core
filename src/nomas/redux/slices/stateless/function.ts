import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FunctionSlice {
    function: Function;
}

export enum Function {
    Deposit = "deposit",
    Withdraw = "withdraw",
    Swap = "swap",
}

const initialState: FunctionSlice = {
    function: Function.Deposit,
}

export const functionSlice = createSlice({
    name: "function",
    initialState,
    reducers: {
        setFunction: (state, action: PayloadAction<Function>) => {
            state.function = action.payload
        },
    },
})

export const { setFunction } = functionSlice.actions
export const functionReducer = functionSlice.reducer