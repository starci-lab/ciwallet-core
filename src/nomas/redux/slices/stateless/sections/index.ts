import { combineReducers } from "@reduxjs/toolkit"
import { homeSectionReducer } from "./home"
import { swapSectionReducer } from "./swap"

export const sectionsReducer = combineReducers({
    home: homeSectionReducer,
    swap: swapSectionReducer,
})

export * from "./home"
export * from "./swap"