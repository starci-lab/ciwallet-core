import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionsReducer } from "./functions"
import { tabsReducer } from "./tabs"
import { functionReducer } from "./function"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    functions: functionsReducer,
    tabs: tabsReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./tabs"
export * from "./functions"