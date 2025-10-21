import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId, Network, TokenId, type Token } from "@ciwallet-sdk/types"
import { persistReducer } from "redux-persist"
import { getStorageConfig } from "../../utils"
import { tokenManagerObj } from "@/nomas/obj"

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
    rpcs: Record<ChainId, Record<Network, Array<string>>>;
    tokens: Record<ChainId, Record<Network, Array<Token>>>;    
}

const initialState: SessionSlice = {
    accounts: {},
    encryptedMnemonic: "",
    network: Network.Mainnet,
    chainId: ChainId.Monad,
    initialized: false,
    password: "",
    rpcs: {
        [ChainId.Monad]: {
            [Network.Mainnet]: [
                "https://testnet-rpc.monad.xyz",
            ],
            [Network.Testnet]: [
                "https://testnet-rpc.monad.xyz",
            ],
        },
        [ChainId.Solana]: {
            [Network.Mainnet]: [
                "https://api.devnet.solana.com",
            ],
            [Network.Testnet]: [
                "https://api.devnet.solana.com",
            ],
        },
        [ChainId.Sui]: {
            [Network.Mainnet]: [
                "https://fullnode.testnet.sui.io:443",
            ],
            [Network.Testnet]: [
                "https://fullnode.testnet.sui.io:443",
            ],
        },
        [ChainId.Aptos]: {
            [Network.Mainnet]: [
                "https://fullnode.testnet.sui.io:443",
            ],
            [Network.Testnet]: [
                "https://fullnode.testnet.sui.io:443",
            ],
        },
    },
    tokens: {
        [ChainId.Monad]: {
            [Network.Mainnet]: [],
            [Network.Testnet]: [],
        },
        [ChainId.Solana]: {
            [Network.Mainnet]: [],
            [Network.Testnet]: [],
        },
        [ChainId.Sui]: {
            [Network.Mainnet]: [],
            [Network.Testnet]: [],
        },
        [ChainId.Aptos]: {
            [Network.Mainnet]: [],
            [Network.Testnet]: [],
        },
    },
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
        // add rpc
        addRpc: (state, action: PayloadAction<AddRpcParams>) => {
            if (!state.rpcs[action.payload.chainId]) {
                state.rpcs[action.payload.chainId] = {
                    [Network.Mainnet]: [],
                    [Network.Testnet]: [],
                }
            }
            if (!state.rpcs[action.payload.chainId]![action.payload.network]) {
                state.rpcs[action.payload.chainId]![action.payload.network] = []
            }
            state.rpcs[action.payload.chainId]![action.payload.network]!.push(action.payload.rpc)
        },
    },
    selectors: {
        selectSelectedAccount: (state) => {
            const accounts = state.accounts[state.chainId]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return accounts.accounts[0]
            const account = state.accounts[state.chainId]!.accounts.find(
                (account) => account.id === selectedAccountId && account.chainId === state.chainId
            )
            return account
        },
        selectSelectedAccountByChainId: (state, chainId: ChainId) => {
            const accounts = state.accounts[chainId]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return accounts.accounts[0]
            const account = state.accounts[chainId]!.accounts.find(
                (account) => account.id === selectedAccountId && account.chainId === chainId
            )
            return account
        },
        selectTokens: (state) => {
            const tokens = tokenManagerObj.getTokensByChainIdAndNetwork(state.chainId, state.network)
            tokens.push(
                ...(state.tokens?.[state.chainId]?.[state.network] || []),
            )
            return tokens
        },
        selectTokensByChainIdAndNetwork: (state, chainId: ChainId, network: Network) => {
            const tokens = tokenManagerObj.getTokensByChainIdAndNetwork(chainId, network)
            tokens.push(
                ...(state.tokens?.[chainId]?.[network] || []),
            )
            return tokens
        },
        selectTokenById: (state, tokenId: TokenId) => {
            const tokens = tokenManagerObj.getTokensByChainIdAndNetwork(state.chainId, state.network)
            tokens.push(
                ...(state.tokens?.[state.chainId]?.[state.network] || []),
            )
            const token = tokens.find((token) => token.tokenId === tokenId)
            if (!token) throw new Error("Token not found")
            return token
        },
    },
})

export interface AddRpcParams {
    chainId: ChainId;
    network: Network;
    rpc: string;
}   

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
    addRpc,
} = sessionSlice.actions
export const { selectSelectedAccount, selectSelectedAccountByChainId, selectTokens, selectTokensByChainIdAndNetwork, selectTokenById } = sessionSlice.selectors
