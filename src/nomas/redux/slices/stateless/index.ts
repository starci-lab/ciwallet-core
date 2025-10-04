import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
})

export * from "./pages"