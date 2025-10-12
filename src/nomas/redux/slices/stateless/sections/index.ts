import { combineReducers } from "@reduxjs/toolkit"
import { depositSectionReducer } from "./deposit"
import { homeSectionReducer } from "./home"

export const sectionsReducer = combineReducers({
    deposit: depositSectionReducer,
    home: homeSectionReducer,
})

export * from "./deposit"
export * from "./home"