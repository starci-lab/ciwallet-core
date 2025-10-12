import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionsReducer } from "./functions"
import { tabsReducer } from "./tabs"
import { functionReducer } from "./function"
import { userReducer } from "@/nomas/redux/slices/stateless/user"

export const statelessReducer = combineReducers({
  pages: pagesReducer,
  scene: sceneReducer,
  function: functionReducer,
  user: userReducer,
  functions: functionsReducer,
  tabs: tabsReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./user"
export * from "./tabs"
export * from "./functions"
