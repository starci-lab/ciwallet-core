import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
    createListenerMiddleware,
    isAnyOf,
} from "@reduxjs/toolkit"
import {
    ChainId,
    Network,
    type Token,
    Platform,
    TokenId,
    UnifiedTokenId,
} from "@ciwallet-sdk/types"
import { persistReducer } from "redux-persist"
import { getStorageConfig } from "../../utils"
import {
    encryptionObj,
    importedWalletGeneratorObj,
    tokenManagerObj,
    walletGeneratorObj,
} from "@/nomas/obj"
import { v4 as uuidv4 } from "uuid"
import {
    setPrice,
    type AppDispatch,
    type RootState,
    setUnifiedPrice,
} from "@/nomas/redux"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import {
    subscribeToPythUpdates,
    subscribeToUnifiedPythUpdates,
} from "@ciwallet-sdk/pyth"
import lodash from "lodash"
import { ExplorerId } from "@ciwallet-sdk/classes"
/* -----------------------------
 * Types
 * ----------------------------- */
export enum PlatformAccountType {
    HDWallet = "hd-wallet",
    ImportedWallet = "imported-wallet",
}

export type Account =
  | {
      id: string
      accountAddress: string
      privateKey: string
      type: PlatformAccountType.HDWallet
      platform: Platform
      index: number
      refId: string
    }
  | {
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


export interface TokenItem {
  tokenId: TokenId
  accountAddress: string
  chainId: ChainId
  network: Network
  isToken2022?: boolean
}

export type SelectedChainId = ChainId | "overview"
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
  importedTokens: Partial<Record<ChainId, Record<Network, Array<Token>>>>
  tokens: Record<ChainId, Record<Network, Array<Token>>>
  // tracking token ids and unified token ids
  trackingTokenIds: Array<TokenId>
  trackingUnifiedTokenIds: Array<UnifiedTokenId>

  explorers: Partial<Record<ChainId, ExplorerId>>
}

/* -----------------------------
 * Thunk: resolve account hd wallet and imported wallets
 * ----------------------------- */
const resolveAccountsFromHdWallet = async (
    hdWallet: HDWallet,
    password: string
): Promise<Array<Account>> => {
    // 1. Derive private key from index
    const mnemonic = await encryptionObj.decrypt(
        hdWallet.encryptedMnemonic,
        password
    )
    // 2. Generate wallets
    const wallets = (
        await Promise.all(
            hdWallet.accounts.map(async (account) => {
                const wallets = await walletGeneratorObj
                    .generateWallets({
                        mnemonic,
                        password,
                        index: account.index,
                    })
                    .then((wallets) =>
                        Object.values(wallets).map((wallet) => ({
                            id: `hd-wallet-${uuidv4()}`,
                            accountAddress: wallet.accountAddress,
                            privateKey: wallet.privateKey,
                            type: PlatformAccountType.HDWallet,
                            platform: wallet.platform,
                            refId: hdWallet.id,
                            index: account.index,
                        }))
                    )
                const decryptedWallets = await Promise.all(
                    wallets.map(async (wallet) => ({
                        ...wallet,
                        privateKey: await encryptionObj.decrypt(
                            wallet.privateKey,
                            password
                        ),
                    }))
                )
                return decryptedWallets
            })
        )
    ).flat()
    // 3. Return accounts
    return wallets
}

const resolveAccountsFromImportedWallet = async (
    importedWallet: ImportedWallet,
    password: string
): Promise<Array<Account>> => {
    const privateKey = await encryptionObj.decrypt(
        importedWallet.encryptedPrivateKey,
        password
    )
    const wallet = await importedWalletGeneratorObj.generateWallet({
        privateKey,
        platform: importedWallet.platform,
    })
    return [
        {
            id: `imported-wallet-${uuidv4()}`,
            accountAddress: wallet.accountAddress,
            privateKey: await encryptionObj.decrypt(wallet.privateKey, password),
            type: PlatformAccountType.ImportedWallet,
            platform: importedWallet.platform,
            refId: importedWallet.id,
        },
    ]
}

export const resolveAccountsThunk = createAsyncThunk<Array<Account>>(
    "accounts/resolveAll",
    async (_, thunkApi): Promise<Array<Account>> => {
        try {
            console.log("Resolve accounts")
            const state = thunkApi.getState() as RootState
            // Resolve HD wallet accounts
            const hdAccounts = await Promise.all(
                state.persists.session.hdWallets.map((hdWallet) =>
                    resolveAccountsFromHdWallet(hdWallet, state.persists.session.password)
                )
            )
            // Resolve imported wallets in parallel
            const importedAccounts = await Promise.all(
                state.persists.session.importedWallets.map((importedWallet) =>
                    resolveAccountsFromImportedWallet(
                        importedWallet,
                        state.persists.session.password
                    )
                )
            )
            // Combine and return
            return [...hdAccounts.flat(), ...importedAccounts.flat()]
        } catch (err: unknown) {
            throw new Error(
                err instanceof Error ? err.message : "Failed to resolve accounts"
            )
        }
    }
)

export const resolveTokensThunk = createAsyncThunk<
  Record<ChainId, Record<Network, Array<Token>>>
>(
    "tokens/resolveAll",
    async (
        _,
        thunkApi
    ): Promise<Record<ChainId, Record<Network, Array<Token>>>> => {
        try {
            const state = thunkApi.getState() as RootState
            const results: Partial<
        Record<ChainId, Partial<Record<Network, Array<Token>>>>
      > = {}
            const _importedTokens = lodash.cloneDeep(
                state.persists.session.importedTokens
            )
            for (const chainId of Object.values(ChainId)) {
                for (const network of Object.values(Network)) {
                    // default tokens
                    const defaultTokens = tokenManagerObj.getTokensByChainIdAndNetwork(
                        chainId,
                        network
                    )
                    const extraTokens = _importedTokens?.[chainId]?.[network] ?? []
                    // combine tokens
                    if (!results[chainId]) {
                        results[chainId] = {
                            [Network.Mainnet]: [],
                            [Network.Testnet]: [],
                        }
                    }
          results[chainId]![network] = [...defaultTokens, ...extraTokens]
                }
            }
            return results as Record<ChainId, Record<Network, Array<Token>>>
        } catch (err: unknown) {
            console.log(err)
            throw new Error(
                err instanceof Error ? err.message : "Failed to resolve tokens"
            )
        }
    }
)

export interface UpdateRpcParams {
    chainId: ChainId
    network: Network
    index: number
    rpc: string
}

/* -----------------------------
 * Initial state
 * ----------------------------- */
const initialState: SessionSlice = {
    accounts: {},
    hdWallets: [],
    importedWallets: [],
    encryptedMnemonic: "",
    network: Network.Testnet,
    chainId: ChainId.Monad,
    initialized: false,
    password: "",
    importedTokens: {},
    trackingTokenIds: [
        TokenId.MonadTestnetMon,
        TokenId.MonadTestnetWmon,
        TokenId.MonadTestnetUsdc,
        TokenId.SolanaMainnetSol,
        TokenId.SolanaMainnetUsdc,
        TokenId.SolanaTestnetSol,
        TokenId.SolanaTestnetUsdc,
        TokenId.SuiMainnetSui,
        TokenId.SuiMainnetUsdc,
        TokenId.SuiTestnetSui,
        TokenId.SuiTestnetUsdc,
    ],
    trackingUnifiedTokenIds: [UnifiedTokenId.Usdc, UnifiedTokenId.Usdt],
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
            [Network.Mainnet]: ["https://fullnode.mainnet.aptoslabs.com/v1"],
            [Network.Testnet]: ["https://fullnode.testnet.aptoslabs.com/v1"],
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
    explorers: {
        [ChainId.Monad]: ExplorerId.MonVision,
        [ChainId.Solana]: ExplorerId.SolanaExplorer,
        [ChainId.Sui]: ExplorerId.SuiExplorer,
        [ChainId.Aptos]: ExplorerId.AptosExplorer,
        [ChainId.Bsc]: ExplorerId.Bscscan,
        [ChainId.Polygon]: ExplorerId.Polygonscan,
        [ChainId.Ethereum]: ExplorerId.Etherscan,
        [ChainId.Arbitrum]: ExplorerId.Arbiscan,
        [ChainId.Base]: ExplorerId.Base,
        [ChainId.Avalanche]: ExplorerId.Snowtrace,
        [ChainId.Fantom]: ExplorerId.Ftmscan,
    },
}
/* -----------------------------
 * Slice
 * ----------------------------- */
export interface SetExplorerParams {
  chainId: ChainId
  explorerId: ExplorerId
}
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
        addTrackingTokenId: (state, action: PayloadAction<TokenId>) => {
            state.trackingTokenIds.push(action.payload)
        },
        addTrackingUnifiedTokenId: (state, action: PayloadAction<UnifiedTokenId>) => {
            state.trackingUnifiedTokenIds.push(action.payload)
        },
        removeTrackingTokenId: (state, action: PayloadAction<TokenId>) => {
            state.trackingTokenIds = state.trackingTokenIds.filter((id) => id !== action.payload)
        },
        removeTrackingUnifiedTokenId: (state, action: PayloadAction<UnifiedTokenId>) => {
            state.trackingUnifiedTokenIds = state.trackingUnifiedTokenIds.filter((id) => id !== action.payload)
        },
        updateRpc: (state, action: PayloadAction<UpdateRpcParams>) => {
            if (!state.rpcs[action.payload.chainId]) {
                state.rpcs[action.payload.chainId] = {
                    [Network.Mainnet]: [],
                    [Network.Testnet]: [],
                }
            }
            if (!state.rpcs[action.payload.chainId]![action.payload.network]) {
                state.rpcs[action.payload.chainId]![action.payload.network] = []
            }
            state.rpcs[action.payload.chainId]![action.payload.network]![action.payload.index] = action.payload.rpc
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
        setExplorer: (state, action: PayloadAction<SetExplorerParams>) => {
            state.explorers[action.payload.chainId] = action.payload.explorerId
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
        builder.addCase(
            resolveTokensThunk.fulfilled,
            (
                state,
                action: PayloadAction<Record<ChainId, Record<Network, Array<Token>>>>
            ) => {
                state.tokens = action.payload
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
            const tokens = Object.values(state.tokens)
                .flat()
                .flatMap((record) => Object.values(record).flat())
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
        selectTokensByChainIdAndNetwork: (
            state,
            chainId: ChainId,
            network: Network
        ) => {
            return state.tokens[chainId]?.[network] || []
        },
        selectTokens: (state) => {
            const tokens = Object.values(state.tokens)
                .flat()
                .flatMap((record) => Object.values(record).flat())
            return tokens.filter((token) => token.network === state.network)
        },
        selectTokensTracking: (state) => {
            const { trackingUnifiedTokenIds, trackingTokenIds, tokens } = state
            const allTokens = Object.values(tokens)
                .flat()
                .flatMap((record) => Object.values(record).flat())
            const trackingTokens = allTokens.filter((token) => {
                return (
                    trackingTokenIds.includes(token.tokenId) ||
                    (token.unifiedTokenId && trackingUnifiedTokenIds.includes(token.unifiedTokenId))
                )
            })
            return trackingTokens.filter((token) => token.network === state.network)
        },
        selectNonUnifiedTokensTrackingOnly: (state) => {
            const { trackingTokenIds, tokens } = state
            const allTokens = Object.values(tokens)
                .flat()
                .flatMap((record) => Object.values(record).flat())
            const trackingTokens = allTokens.filter((token) => {
                return trackingTokenIds.includes(token.tokenId) && !token.unifiedTokenId
            })
            return trackingTokens.filter((token) => token.network === state.network)
        },
        selectUnifiedTokensTrackingOnly: (state) => {
            const unifiedTokens = tokenManagerObj.getUnifiedTokens()
            return unifiedTokens.filter((unifiedToken) => {
                return unifiedToken.unifiedTokenId && state.trackingUnifiedTokenIds.includes(unifiedToken.unifiedTokenId)
            })
        },
        selectSelectedAccounts: (state): Partial<Record<Platform, Account>> => {
            if (!state.accounts) return {}
            const selected: Partial<Record<Platform, Account>> = {}
            for (const [platform, { accounts, selectedAccountId }] of Object.entries(
                state.accounts
            ) as Array<
        [Platform, { accounts: Array<Account>; selectedAccountId?: string }]
      >) {
                const acc = accounts.find((account, index) =>
                    selectedAccountId ? account.id === selectedAccountId : index === 0
                )
                if (acc) selected[platform] = acc
            }
            return selected
        },
        selectTokensByUnifiedTokenId: (state, unifiedTokenId: UnifiedTokenId) => {
            const tokens = Object.values(state.tokens)
                .flat()
                .flatMap((record) => Object.values(record).flat())
            const tokensSameUnifiedTokenId = tokens.filter(
                (token) => token.unifiedTokenId === unifiedTokenId
            )
            return tokensSameUnifiedTokenId
        },
        selectHdWalletById: (state, hdWalletId: string) => {
            return state.hdWallets.find((hdWallet) => hdWallet.id === hdWalletId)
        },
        selectAccountsByHdWalletId: (state, hdWalletId: string) => {
            return Object.values(state.accounts).flatMap((accounts) => accounts.accounts.filter((account) => account.refId === hdWalletId))
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
        blacklist: ["password", "accounts", "tokens"],
    }),
    sessionSlice.reducer
)

export const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
    matcher: isAnyOf(resolveTokensThunk.fulfilled),
    effect: async (_, listenerApi) => {
        const state = listenerApi.getState() as RootState
        const dispatch = listenerApi.dispatch as AppDispatch
        // logic to retrieve tracking tokens
        const { trackingUnifiedTokenIds, trackingTokenIds, tokens } = state.persists.session
        const allTokens = Object.values(tokens)
            .flat()
            .flatMap((record) => Object.values(record).flat())
        const trackingTokens = allTokens.filter((token) => {
            return (
                trackingTokenIds.includes(token.tokenId) ||
                    (token.unifiedTokenId && trackingUnifiedTokenIds.includes(token.unifiedTokenId))
            )
        })
        // subscribe to token prices
        await subscribeToPythUpdates(trackingTokens, (tokenId, price) => {
            dispatch(
                setPrice({
                    tokenId,
                    price,
                })
            )
        })
        // subscribe to unified token prices
        const unifiedTokens = tokenManagerObj.getUnifiedTokens()
        await subscribeToUnifiedPythUpdates(
            unifiedTokens,
            (unifiedTokenId, price) => {
                dispatch(
                    setUnifiedPrice({
                        unifiedTokenId,
                        price,
                    })
                )
            }
        )
    },
})

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
    updateRpc,
    setExplorer,
    addTrackingTokenId,
    addTrackingUnifiedTokenId,
    removeTrackingTokenId,
    removeTrackingUnifiedTokenId,
} = sessionSlice.actions

export const {
    selectSelectedAccount,
    selectSelectedAccountByPlatform,
    selectSelectedAccountByChainId,
    selectTokensByChainIdAndNetwork,
    selectTokens,
    selectTokensTracking,
    selectNonUnifiedTokensTrackingOnly,
    selectUnifiedTokensTrackingOnly,
    selectTokenById,
    selectSelectedAccounts,
    selectTokensByUnifiedTokenId,
    selectHdWalletById,
    selectAccountsByHdWalletId,
} = sessionSlice.selectors
