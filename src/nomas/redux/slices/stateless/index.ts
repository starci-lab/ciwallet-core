import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionReducer } from "./function"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"