import { combineReducers } from "@reduxjs/toolkit"
import { homeReducer } from "./home"
import { swapReducer } from "./swap"
import { myWalletsReducer } from "./my-wallets"
import { settingsReducer } from "./settings"
import { copyAddressReducer } from "./copy-address"
import { perpReducer } from "./perp"

export const sectionsReducer = combineReducers({
    home: homeReducer,
    swap: swapReducer,
    myWallets: myWalletsReducer,
    settings: settingsReducer,
    perp: perpReducer,
    copyAddress: copyAddressReducer,
})

export * from "./home"
export * from "./swap"
export * from "./my-wallets"
export * from "./settings"
export * from "./copy-address"
export * from "./perp"