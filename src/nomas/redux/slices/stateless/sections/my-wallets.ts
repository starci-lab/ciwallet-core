import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Platform } from "@ciwallet-sdk/types"

export enum MyWalletsPage {
    Accounts = "accounts",
    Management = "management",
    SelectAccount = "selectAccount",
    HDWalletDetails = "hdWalletDetails",
    SelectWalletPlatform = "selectWalletPlatform",
    InputPrivateKey = "inputPrivateKey",
    ImportedWalletDetails = "importedWalletDetails",
    SelectHDWalletCreationType = "selectHDWalletCreationType",
    CreateNewHDWallet = "createNewHDWallet",
    ImportExistingHDWallet = "importExistingHDWallet",
}

export enum HDWalletCreationType {
    CreateNewWallet = "create-new-wallet",
    ImportExistingWallet = "import-existing-wallet",
}

export enum MyWalletsManagementTab {
    HDWallets = "hd-wallets",
    ImportedWallets = "imported-wallets",
}

export interface MyWalletsSlice {
    page: MyWalletsPage;
    selectedPlatform: Platform;
    selectedPrivateKeyPlatform: Platform;
    hdWalletsAccordionAccountId: string;
    managementTab: MyWalletsManagementTab;
    hdWalletId: string;
    selectedImportedWalletId: string;
    selectedHDWalletCreationType: HDWalletCreationType;
    use24Words: boolean;
}

const initialState: MyWalletsSlice = {
    page: MyWalletsPage.Accounts,
    selectedPlatform: Platform.Evm,
    selectedPrivateKeyPlatform: Platform.Evm,
    hdWalletsAccordionAccountId: "",
    managementTab: MyWalletsManagementTab.HDWallets,
    hdWalletId: "",
    selectedImportedWalletId: "",
    selectedHDWalletCreationType: HDWalletCreationType.CreateNewWallet,
    use24Words: true,
}

export const myWalletsSlice = createSlice({
    name: "myWallets",
    initialState,
    reducers: {
        setMyWalletsPage: (state, action: PayloadAction<MyWalletsPage>) => {
            state.page = action.payload
        },
        setSelectedPlatform: (state, action: PayloadAction<Platform>) => {
            state.selectedPlatform = action.payload
        },
        setSelectedPrivateKeyPlatform: (state, action: PayloadAction<Platform>) => {
            state.selectedPrivateKeyPlatform = action.payload
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
        setSelectedImportedWalletId: (state, action: PayloadAction<string>) => {
            state.selectedImportedWalletId = action.payload
        },
        setSelectedHDWalletCreationType: (state, action: PayloadAction<HDWalletCreationType>) => {
            state.selectedHDWalletCreationType = action.payload
        },
        setUseImportedHDWallet24Words: (state, action: PayloadAction<boolean>) => {
            state.use24Words = action.payload
        },
    },
})

export const { setMyWalletsPage, setSelectedPlatform, setSelectedPrivateKeyPlatform, setHdWalletsAccordionAccountId, setManagementTab, setHdWalletId, setSelectedImportedWalletId, setSelectedHDWalletCreationType, setUseImportedHDWallet24Words } = myWalletsSlice.actions
export const myWalletsReducer = myWalletsSlice.reducer