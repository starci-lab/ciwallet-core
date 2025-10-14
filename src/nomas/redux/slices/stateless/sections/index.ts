import { combineReducers } from "@reduxjs/toolkit"
import { homeSectionReducer } from "./home"

export const sectionsReducer = combineReducers({
    home: homeSectionReducer,
})

export * from "./home"