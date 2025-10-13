import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { sectionsReducer } from "./sections"
import { tabsReducer } from "./tabs"
import { functionReducer } from "./function"
import { userReducer } from "./user"
export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    tabs: tabsReducer,
    user: userReducer,
    sections: sectionsReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./sections"
export * from "./tabs"
export * from "./function"
export * from "./user"