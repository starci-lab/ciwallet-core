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
    HDWalletRecoverPhaseWarning = "hdWalletRecoverPhaseWarning",
    HDWalletRecoverPhase = "hdWalletRecoverPhase",  
    HDWalletAccounts = "hdWalletAccounts",
    HDWalletPrivateKeyWarning = "hdWalletPrivateKeyWarning",
    HDWalletPrivateKey = "hdWalletPrivateKey",
    PrivateKey = "privateKey",
    RemoveHDWalletWarning = "removeHDWalletWarning",
    EditHDWallet = "editHDWallet",
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
    iUnderstandHDWalletRecoverPhaseWarning: boolean;
    iUnderstandHDWalletPrivateKeyWarning: boolean;
    ephemeralPrivateKey: string;
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
    iUnderstandHDWalletRecoverPhaseWarning: false,
    iUnderstandHDWalletPrivateKeyWarning: false,
    ephemeralPrivateKey: "",
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
        setIUnderstandHDWalletRecoverPhaseWarning: (state, action: PayloadAction<boolean>) => {
            state.iUnderstandHDWalletRecoverPhaseWarning = action.payload
        },
        setIUnderstandHDWalletPrivateKeyWarning: (state, action: PayloadAction<boolean>) => {
            state.iUnderstandHDWalletPrivateKeyWarning = action.payload
        },
        setEphemeralPrivateKey: (state, action: PayloadAction<string>) => {
            state.ephemeralPrivateKey = action.payload
        },
    },
})

export const { 
    setMyWalletsPage, 
    setSelectedPlatform, 
    setSelectedPrivateKeyPlatform, 
    setHdWalletsAccordionAccountId, 
    setManagementTab, 
    setHdWalletId, 
    setSelectedImportedWalletId, 
    setSelectedHDWalletCreationType, 
    setUseImportedHDWallet24Words, 
    setIUnderstandHDWalletRecoverPhaseWarning, 
    setIUnderstandHDWalletPrivateKeyWarning,
    setEphemeralPrivateKey
} = myWalletsSlice.actions
export const myWalletsReducer = myWalletsSlice.reducer