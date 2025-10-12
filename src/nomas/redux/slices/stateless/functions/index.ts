import { combineReducers } from "@reduxjs/toolkit"
import { depositFunctionReducer } from "./deposit"

export const functionsReducer = combineReducers({
    deposit: depositFunctionReducer,
})

export * from "./deposit"