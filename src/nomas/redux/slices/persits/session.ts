import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId, Network } from "@ciwallet-sdk/types"
import { persistReducer } from "redux-persist"
import { getStorageConfig } from "../../utils"

export interface ReduxAccount {
    // generated id from uuid
    id: string;
    accountAddress: string;
    chainId: ChainId;
    encryptedPrivateKey: string;
    publicKey: string;
    name: string;
    avatarUrl?: string;
    privateKey?: string;
}

export interface Accounts {
    accounts: Array<ReduxAccount>;
    selectedAccountId?: string;
}

export interface SessionSlice {
    accounts: Partial<Record<ChainId, Accounts>>;
    encryptedMnemonic: string;
    network: Network;
    chainId: ChainId;
    initialized: boolean;
    // use worker to remove after a period of time
    password: string;
}

const initialState: SessionSlice = {
    accounts: {},
    encryptedMnemonic: "",
    network: Network.Mainnet,
    chainId: ChainId.Monad,
    initialized: false,
    password: "",
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        // set password
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        // add account
        addAccount: (
            state, 
            { payload: { chainId, account } }: PayloadAction<AddAccountParams>
        ) => {
            // if chain id is not in state.accounts, create it
            if (!state.accounts[chainId]) {
                state.accounts[chainId] = {
                    accounts: [],
                }
            }
            // push account to accounts
            state.accounts[chainId]!.accounts.push(account)
        },
        // set encrypted mnemonic
        setEncryptedMnemonic: (state, action: PayloadAction<string>) => {
            state.encryptedMnemonic = action.payload
        },
        // set selected account id
        setSelectedAccountId: (state, { 
            payload: 
            { 
                chainId, 
                selectedAccountId 
            } 
        }: PayloadAction<SetSelectedAccountIdParams>) => {
            // if chain id is not in state.accounts, create it
            if (!state.accounts[chainId]) {
                state.accounts[chainId] = {
                    accounts: [],
                }
            }
            state.accounts[chainId]!.selectedAccountId = selectedAccountId
        },
        // set network
        setNetwork: (state, action: PayloadAction<Network>) => {
            state.network = action.payload
        },
        // set chain id
        setChainId: (state, action: PayloadAction<ChainId>) => {
            state.chainId = action.payload
        },
        // set initialized
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload
        },
    },
    selectors: {
        selectSelectedAccount: (state) => {
            const accounts = state.accounts[state.chainId]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return null
            const account = state.accounts[state.chainId]!.accounts.find(
                (account) => account.id === selectedAccountId && account.chainId === state.chainId
            )
            return account
        },
    },
})

export interface AddAccountParams {
    account: ReduxAccount;
    chainId: ChainId;
}

export interface SetSelectedAccountIdParams {
    chainId: ChainId;
    selectedAccountId: string;
}

export const sessionReducer = persistReducer(getStorageConfig(), sessionSlice.reducer)
export const {
    setPassword,
    addAccount,
    setEncryptedMnemonic,
    setSelectedAccountId,
    setNetwork,
    setChainId,
    setInitialized,
} = sessionSlice.actions
export const { selectSelectedAccount } = sessionSlice.selectors
