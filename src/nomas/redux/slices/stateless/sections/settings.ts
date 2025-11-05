import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId } from "@ciwallet-sdk/types"

export enum SettingsPage {
    SelectNetwork = "selectNetwork",
    Main = "main",
    RPC = "rpc",
    RPCDetails = "rpcDetails",
    Explorer = "explorer",
}
export interface SettingsSectionSlice {
    settingsPage: SettingsPage;
    rpcChainId: ChainId;
}

const initialState: SettingsSectionSlice = {
    settingsPage: SettingsPage.Main,
    rpcChainId: ChainId.Monad,
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettingsPage: (state, action: PayloadAction<SettingsPage>) => {
            state.settingsPage = action.payload
        },
        setRPCChainId: (state, action: PayloadAction<ChainId>) => {
            state.rpcChainId = action.payload
        },
    },
})

export const { setSettingsPage, setRPCChainId } = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer