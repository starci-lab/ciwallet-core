import { combineReducers } from "@reduxjs/toolkit"
import { pagesReducer } from "./pages"
import { sceneReducer } from "./scene"
import { functionReducer } from "./function"
import { userReducer } from "@/nomas/redux/slices/stateless/user"

export const statelessReducer = combineReducers({
  pages: pagesReducer,
  scene: sceneReducer,
  function: functionReducer,
  user: userReducer,
})

export * from "./pages"
export * from "./scene"
export * from "./function"
export * from "./user"
