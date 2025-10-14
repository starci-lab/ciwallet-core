import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum HomeTab {
    Home = "home",
    Trade = "trade",
    Perp = "perp",
    Game = "game",
    Nfts = "nfts",
    Defi = "defi",
}

export interface TabsSlice {
    homeTab: HomeTab;
}

const initialState: TabsSlice = {
    homeTab: HomeTab.Home,
}

export const tabsSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        setHomeTab: (state, action: PayloadAction<HomeTab>) => {
            state.homeTab = action.payload
        },
    },
})

export const {
    setHomeTab,
} = tabsSlice.actions

export const tabsReducer = tabsSlice.reducer
