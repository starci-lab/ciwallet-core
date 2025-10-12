import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionReducer } from "./function"
import { tabsReducer } from "./tabs"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    tabs: tabsReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./tabs"