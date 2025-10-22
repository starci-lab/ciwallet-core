import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"
import { ChainId, Network, type Token, Platform, TokenId } from "@ciwallet-sdk/types"
import { persistReducer } from "redux-persist"
import { getStorageConfig } from "../../utils"
import { encryptionObj, importedWalletGeneratorObj, tokenManagerObj, walletGeneratorObj } from "@/nomas/obj"
import { v4 as uuidv4 } from "uuid"
import type { RootState } from "@/nomas/redux"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
/* -----------------------------
 * Types
 * ----------------------------- */
export enum PlatformAccountType {
  HDWallet = "hd-wallet",
  ImportedWallet = "imported-wallet",
}

export type Account = {
  id: string
  accountAddress: string
  privateKey: string
  type: PlatformAccountType.HDWallet
  platform: Platform
  index: number
  refId: string
} | {
  id: string
  accountAddress: string
  privateKey: string
  type: PlatformAccountType.ImportedWallet
  platform: Platform
  refId: string
}

export interface Accounts {
    accounts: Array<Account>
    selectedAccountId?: string
}

export interface HDWalletAccount {
    id: string
    name: string
    index: number
}
export interface HDWallet {
    id: string
    encryptedMnemonic: string
    accounts: Array<HDWalletAccount>
    isDefault: boolean
    name: string
}

export interface ImportedWallet {
    id: string
    platform: Platform
    encryptedPrivateKey: string
    name: string
}

export interface SessionSlice {
  hdWallets: Array<HDWallet>
  importedWallets: Array<ImportedWallet>
  accounts: Partial<Record<Platform, Accounts>>
  encryptedMnemonic: string
  network: Network
  chainId: ChainId
  initialized: boolean
  password: string
  rpcs: Record<ChainId, Record<Network, Array<string>>>
  tokens: Record<ChainId, Record<Network, Array<Token>>>
}

/* -----------------------------
 * Thunk: resolve account hd wallet and imported wallets
 * ----------------------------- */
const resolveAccountsFromHdWallet = async (
    hdWallet: HDWallet,
    password: string,
): Promise<Array<Account>> => {
    // 1. Derive private key from index
    const mnemonic = await encryptionObj.decrypt(hdWallet.encryptedMnemonic, password)
    // 2. Generate wallets
    const wallets = (
        await Promise.all(
            hdWallet.accounts.map(
                async (account) => walletGeneratorObj.generateWallets({
                    mnemonic,
                    password,
                    index: account.index,
                }).then((wallets) => Object.values(wallets).map((wallet) => ({
                    id: `hd-wallet-${uuidv4()}`,
                    accountAddress: wallet.accountAddress,
                    privateKey: wallet.privateKey,
                    type: PlatformAccountType.HDWallet,
                    platform: wallet.platform,
                    refId: hdWallet.id,
                    index: account.index,
                })))
            ))).flat()
    // 3. Return accounts
    return wallets
}

const resolveAccountsFromImportedWallet = async (
    importedWallet: ImportedWallet,
    password: string,
): Promise<Array<Account>> => {
    const privateKey = await encryptionObj.decrypt(importedWallet.encryptedPrivateKey, password)
    const wallet = await importedWalletGeneratorObj.generateWallet({
        privateKey,
        platform: importedWallet.platform,
    })
    return [{
        id: `imported-wallet-${uuidv4()}`,
        accountAddress: wallet.accountAddress,
        privateKey: wallet.privateKey,
        type: PlatformAccountType.ImportedWallet,
        platform: importedWallet.platform,
        refId: importedWallet.id,
    }]
}

export const resolveAccountsThunk = createAsyncThunk<
  Array<Account>
>(
    "accounts/resolveAll",
    async (_, thunkApi): Promise<Array<Account>> => {
        try {
            const state = thunkApi.getState() as RootState
            // Resolve HD wallet accounts
            const hdAccounts = await Promise.all(
                state.persists.session.hdWallets.map((hdWallet) => resolveAccountsFromHdWallet(hdWallet, state.persists.session.password)))
            // Resolve imported wallets in parallel
            const importedAccounts = await Promise.all(state.persists.session.importedWallets.map((importedWallet) => resolveAccountsFromImportedWallet(importedWallet, state.persists.session.password)))
            // Combine and return
            return [...hdAccounts.flat(), ...importedAccounts.flat()]
        } catch (err: unknown) {
            throw new Error(err instanceof Error ? err.message : "Failed to resolve accounts")
        }
    }
)

/* -----------------------------
 * Initial state
 * ----------------------------- */
const initialState: SessionSlice = {
    accounts: {},
    hdWallets: [],
    importedWallets: [],
    encryptedMnemonic: "",
    network: Network.Mainnet,
    chainId: ChainId.Monad,
    initialized: false,
    password: "",
    rpcs: {
        [ChainId.Monad]: {
            [Network.Mainnet]: ["https://testnet-rpc.monad.xyz"],
            [Network.Testnet]: ["https://testnet-rpc.monad.xyz"],
        },
        [ChainId.Solana]: {
            [Network.Mainnet]: ["https://api.devnet.solana.com"],
            [Network.Testnet]: ["https://api.devnet.solana.com"],
        },
        [ChainId.Sui]: {
            [Network.Mainnet]: ["https://fullnode.testnet.sui.io:443"],
            [Network.Testnet]: ["https://fullnode.testnet.sui.io:443"],
        },
        [ChainId.Aptos]: {
            [Network.Mainnet]: ["https://fullnode.testnet.sui.io:443"],
            [Network.Testnet]: ["https://fullnode.testnet.sui.io:443"],
        },
        [ChainId.Bsc]: {
            [Network.Mainnet]: ["https://bsc-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://bsc-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Polygon]: {
            [Network.Mainnet]: ["https://polygon-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://polygon-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Ethereum]: {
            [Network.Mainnet]: ["https://eth-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://eth-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Avalanche]: {
            [Network.Mainnet]: ["https://avalanche-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://avalanche-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Fantom]: {
            [Network.Mainnet]: ["https://fantom-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://fantom-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Arbitrum]: {
            [Network.Mainnet]: ["https://arbitrum-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://arbitrum-testnet.g.alchemy.com/v2/demo"],
        },
        [ChainId.Base]: {
            [Network.Mainnet]: ["https://base-mainnet.g.alchemy.com/v2/demo"],
            [Network.Testnet]: ["https://base-testnet.g.alchemy.com/v2/demo"],
        },
    },  
    tokens: {
        [ChainId.Monad]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Solana]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Sui]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Aptos]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Bsc]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Polygon]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Ethereum]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Avalanche]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Fantom]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Arbitrum]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
        [ChainId.Base]: { [Network.Mainnet]: [], [Network.Testnet]: [] },
    },
}

/* -----------------------------
 * Slice
 * ----------------------------- */
export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setEncryptedMnemonic: (state, action: PayloadAction<string>) => {
            state.encryptedMnemonic = action.payload
        },
        setSelectedAccountId: (
            state,
            {
                payload: { account, platform },
            }: PayloadAction<SetSelectedAccountIdParams>
        ) => {
            if (!state.accounts[platform]) {
                state.accounts[platform] = { accounts: [] }
            }
      state.accounts[platform]!.selectedAccountId = account.id
        },
        setNetwork: (state, action: PayloadAction<Network>) => {
            state.network = action.payload
        },
        setChainId: (state, action: PayloadAction<ChainId>) => {
            state.chainId = action.payload
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload
        },
        addHdWallet: (state, action: PayloadAction<HDWallet>) => {
            state.hdWallets.push(action.payload)
        },
        addImportedWallet: (state, action: PayloadAction<ImportedWallet>) => {
            state.importedWallets.push(action.payload)
        },
        addRpc: (state, action: PayloadAction<AddRpcParams>) => {
            if (!state.rpcs[action.payload.chainId]) {
                state.rpcs[action.payload.chainId] = {
                    [Network.Mainnet]: [],
                    [Network.Testnet]: [],
                }
            }
      state.rpcs[action.payload.chainId]![action.payload.network]!.push(
          action.payload.rpc
      )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            resolveAccountsThunk.fulfilled,
            (state, action: PayloadAction<Array<Account>>) => {
                const accounts = action.payload
                accounts.forEach((account) => {
                    if (!state.accounts[account.platform]) {
                        state.accounts[account.platform] = { accounts: [] }
                    }
                    state.accounts[account.platform]!.accounts.push(account)
                })
            }
        )
    },
    selectors: {
        selectSelectedAccount: (state) => {
            const platform = chainIdToPlatform(state.chainId)
            const accounts = state.accounts[platform]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return accounts.accounts[0]
            const account = accounts.accounts.find((a) => a.id === selectedAccountId)
            return account || null
        },
        selectTokenById: (state, tokenId: TokenId) => {
            const tokens = Object.values(state.tokens).flat().flatMap((record) => Object.values(record).flat())
            const token = tokens.find((token) => token.tokenId === tokenId)
            if (!token) throw new Error(`Token with id ${tokenId} not found`)
            return token
        },
        selectSelectedAccountByChainId: (state) => {
            const chainId = state.chainId
            const platform = chainIdToPlatform(chainId)
            const accounts = state.accounts[platform]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return accounts.accounts[0]
            const account = accounts.accounts.find((a) => a.id === selectedAccountId)
            return account || null
        },
        selectSelectedAccountByPlatform: (state, platform: Platform) => {
            const accounts = state.accounts[platform]
            if (!accounts) return null
            const { selectedAccountId } = accounts
            if (!selectedAccountId) return accounts.accounts[0]
            const account = accounts.accounts.find((a) => a.id === selectedAccountId)
            return account || null
        },
        selectTokensByChainIdAndNetwork: (state, chainId: ChainId, network: Network) => {
            return state.tokens[chainId]?.[network] || []
        },
        selectTokens: (state) => {
            const tokens = tokenManagerObj.getTokensByChainIdAndNetwork(
                state.chainId,
                state.network
            )
            tokens.push(...(state.tokens?.[state.chainId]?.[state.network] || []))
            return tokens
        },
    },
})

/* -----------------------------
 * Types and Exports
 * ----------------------------- */
export interface AddRpcParams {
  chainId: ChainId
  network: Network
  rpc: string
}

export interface SetSelectedAccountIdParams {
  platform: Platform
  account: Account
}

export const sessionReducer = persistReducer(
    getStorageConfig({
        blacklist: ["password", "accounts"],
    }),
    sessionSlice.reducer
)

export const {
    setPassword,
    setEncryptedMnemonic,
    setSelectedAccountId,
    setNetwork,
    setChainId,
    setInitialized,
    addHdWallet,
    addImportedWallet,
    addRpc,
} = sessionSlice.actions

export const {
    selectSelectedAccount,
    selectSelectedAccountByPlatform,
    selectSelectedAccountByChainId,
    selectTokensByChainIdAndNetwork,
    selectTokens,
    selectTokenById,
} = sessionSlice.selectors
