import { combineReducers } from "@reduxjs/toolkit"
import { homeSectionReducer } from "./home"
import { swapSectionReducer } from "./swap"
import { myWalletsSectionReducer } from "./my-wallets"
import { settingsSectionReducer } from "./settings"
import { copyAddressSectionReducer } from "./copy-address"

export const sectionsReducer = combineReducers({
    home: homeSectionReducer,
    swap: swapSectionReducer,
    myWallets: myWalletsSectionReducer,
    settings: settingsSectionReducer,
    copyAddress: copyAddressSectionReducer,
})

export * from "./home"
export * from "./swap"
export * from "./my-wallets"
export * from "./settings"
export * from "./copy-address"