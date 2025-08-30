

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { AggregatorManager } from "@ciwallet-sdk/classes"

export interface AggregatorSlice {
    manager: AggregatorManager
}

const initialState: AggregatorSlice = {
    manager: new AggregatorManager(),
}

export const aggregatorSlice = createSlice({
    name: "aggregators",
    initialState,
    reducers: {
        setAggregatorManager: (state, action: PayloadAction<AggregatorManager>) => {
            state.manager = action.payload
        },
    },
})

export const aggregatorReducer = aggregatorSlice.reducer
export const {
    setAggregatorManager,
} = aggregatorSlice.actions
