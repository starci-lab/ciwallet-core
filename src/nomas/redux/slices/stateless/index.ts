import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionReducer } from "./function"
import { withdrawReducer } from "./withdraw"

export const statelessReducer = combineReducers({
    pages: pagesReducer,
    scene: sceneReducer,
    function: functionReducer,
    withdraw: withdrawReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./withdraw"
