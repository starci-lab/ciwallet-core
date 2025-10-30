import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Platform } from "@ciwallet-sdk/types"

export enum MyWalletsPage {
    Accounts = "accounts",
    Management = "management",
    SelectAccount = "selectAccount",
    HDWalletDetails = "hdWalletDetails",
}

export enum MyWalletsManagementTab {
    HDWallets = "hd-wallets",
    ImportedWallets = "imported-wallets",
}

export interface MyWalletsSectionSlice {
    page: MyWalletsPage;
    selectedPlatform: Platform;
    hdWalletsAccordionAccountId: string;
    managementTab: MyWalletsManagementTab;
    hdWalletId: string;
}

const initialState: MyWalletsSectionSlice = {
    page: MyWalletsPage.Accounts,
    selectedPlatform: Platform.Evm,
    hdWalletsAccordionAccountId: "",
    managementTab: MyWalletsManagementTab.HDWallets,
    hdWalletId: "",
}

export const myWalletsSectionSlice = createSlice({
    name: "myWalletsSection",
    initialState,
    reducers: {
        setMyWalletsPage: (state, action: PayloadAction<MyWalletsPage>) => {
            state.page = action.payload
        },
        setSelectedPlatform: (state, action: PayloadAction<Platform>) => {
            state.selectedPlatform = action.payload
        },
        setHdWalletsAccordionAccountId: (state, action: PayloadAction<string>) => {
            state.hdWalletsAccordionAccountId = action.payload
        },
        setManagementTab: (state, action: PayloadAction<MyWalletsManagementTab>) => {
            state.managementTab = action.payload
        },
        setHdWalletId: (state, action: PayloadAction<string>) => {
            state.hdWalletId = action.payload
        },
    },
})

export const { setMyWalletsPage, setSelectedPlatform, setHdWalletsAccordionAccountId, setManagementTab, setHdWalletId } = myWalletsSectionSlice.actions
export const myWalletsSectionReducer = myWalletsSectionSlice.reducer