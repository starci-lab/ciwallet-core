import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { sectionsReducer } from "./sections"
import { tabsReducer } from "./tabs"
import { functionReducer } from "./function"
import { userReducer } from "./user"
import { dynamicReducer } from "./dynamic"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    tabs: tabsReducer,
    user: userReducer,
    sections: sectionsReducer,
    dynamic: dynamicReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./sections"
export * from "./tabs"
export * from "./function"
export * from "./user"
export * from "./dynamic"