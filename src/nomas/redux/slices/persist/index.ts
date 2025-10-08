import { combineReducers } from "@reduxjs/toolkit"
import { sessionReducer } from "./session"
import { transactionsReducer } from "./transactions"

export const persistReducer = combineReducers({
    session: sessionReducer,
    transactions: transactionsReducer,
})

export * from "./session"
export * from "./transactions"
