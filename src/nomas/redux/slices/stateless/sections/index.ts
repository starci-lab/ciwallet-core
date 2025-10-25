import { combineReducers } from "@reduxjs/toolkit"
import { homeSectionReducer } from "./home"
import { swapSectionReducer } from "./swap"
import { myWalletsSectionReducer } from "./my-wallets"

export const sectionsReducer = combineReducers({
    home: homeSectionReducer,
    swap: swapSectionReducer,
    myWallets: myWalletsSectionReducer,
})

export * from "./home"
export * from "./swap"
export * from "./my-wallets"