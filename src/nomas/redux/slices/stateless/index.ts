import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { sectionsReducer } from "./sections"
import { tabsReducer } from "./tabs"
import { functionReducer } from "./function"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    sections: sectionsReducer,
    tabs: tabsReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./tabs"
export * from "./sections"