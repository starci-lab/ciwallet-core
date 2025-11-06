import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import * as hl from "@nktkas/hyperliquid"
import { HyperliquidMarketId, type CandleInterval } from "@ciwallet-sdk/classes"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"

export enum PerpSectionPage {
    Perp = "perp",
    Deposit = "deposit",
    SelectAsset = "select-asset",
    SourceChain = "source-chain",
}

export enum PerpTab {
    Trade = "trade",
    Assets = "assets",
    History = "history",
}

export type AllMids = Parameters<
    NonNullable<
        Parameters<
            hl.SubscriptionClient["allMids"]
        >[1]
    >
>[0]

export type PerpMetas = Awaited<
    ReturnType<
        hl.InfoClient["allPerpMetas"]
    >
>

export type CandleSnapshots = Awaited<
    ReturnType<
        hl.InfoClient["candleSnapshot"]
    >
>

export interface HyperunitGenResponse {
    address: string
    signatures: {
        fieldNode: string
        hlNode: string
        unitNode: string
        unitNodeSignature: string
    },
}

export interface PerpSlice {
    tab: PerpTab;
    perpSectionPage: PerpSectionPage;
    perpMetas: PerpMetas;
    approvedAgent: boolean;
    allMids?: AllMids;
    selectedMarketId: HyperliquidMarketId;
    candleSnapshots: CandleSnapshots;
    candleInterval: CandleInterval;
    candleStartTime: number;
    hyperunitGenResponse: Partial<Record<HyperliquidDepositAsset, HyperunitGenResponse>>;
    depositCurrentAsset: HyperliquidDepositAsset;
    depositSourceChainId: ChainId;
}

export interface SetHyperunitGenResponseParam {
    asset: HyperliquidDepositAsset
    response: HyperunitGenResponse
}
const initialState: PerpSlice = {
    tab: PerpTab.Trade,
    perpSectionPage: PerpSectionPage.Perp,
    perpMetas: [],
    approvedAgent: false,
    selectedMarketId: HyperliquidMarketId.BTC,
    candleSnapshots: [],
    candleInterval: "4h",
    candleStartTime: Date.now(),
    depositCurrentAsset: HyperliquidDepositAsset.Usdc,
    depositSourceChainId: ChainId.Arbitrum,
    hyperunitGenResponse: {},
}

export const perpSlice = createSlice({
    name: "perp",
    initialState,
    reducers: {
        setPerpTab: (state, action: PayloadAction<PerpTab>) => {
            state.tab = action.payload
        },
        setPerpSectionPage: (state, action: PayloadAction<PerpSectionPage>) => {
            state.perpSectionPage = action.payload
        },
        setPerpMetas: (state, action: PayloadAction<PerpMetas>) => {
            state.perpMetas = action.payload
        },
        setCandleSnapshots: (state, action: PayloadAction<CandleSnapshots>) => {
            state.candleSnapshots = action.payload
        },
        setAllMids: (state, action: PayloadAction<AllMids>) => {
            state.allMids = action.payload
        },
        setSelectedMarketId: (state, action: PayloadAction<HyperliquidMarketId>) => {
            state.selectedMarketId = action.payload
        },
        setCandleInterval: (state, action: PayloadAction<CandleInterval>) => {
            state.candleInterval = action.payload
        },
        setCandleStartTime: (state, action: PayloadAction<number>) => {
            state.candleStartTime = action.payload
        },
        setLastCandleSnapshot: (state, action: PayloadAction<CandleSnapshots[number]>) => {
            state.candleSnapshots[state.candleSnapshots.length - 1] = action.payload
        },
        setHyperunitGenResponse: (state, action: PayloadAction<SetHyperunitGenResponseParam>) => {
            state.hyperunitGenResponse[action.payload.asset] = action.payload.response
        },
        setDepositCurrentAsset: (state, action: PayloadAction<HyperliquidDepositAsset>) => {
            state.depositCurrentAsset = action.payload
        },
        setDepositSourceChainId: (state, action: PayloadAction<ChainId>) => {
            state.depositSourceChainId = action.payload
        },
        setApprovedAgent: (state, action: PayloadAction<boolean>) => {
            state.approvedAgent = action.payload
        },
    },
    selectors: {
        selectPerpUniverses: (state) => {
            return Object.values(state.perpMetas).flatMap((perpMeta) => perpMeta.universe)
        },
        selectPerpUniverseById: (state) => {
            return state.perpMetas.find((perpMeta) => perpMeta.universe.find((universe) => universe.name === state.selectedMarketId))
        },
        selectSelectedMarketMarkedPrice: (state) => {
            return state.allMids?.mids[state.selectedMarketId]
        },
    },
})

export const { setPerpTab, setPerpSectionPage, setPerpMetas, setAllMids, setSelectedMarketId, setCandleSnapshots, setCandleInterval, setCandleStartTime, setLastCandleSnapshot, setHyperunitGenResponse, setDepositCurrentAsset, setDepositSourceChainId, setApprovedAgent } = perpSlice.actions
export const { selectPerpUniverses, selectPerpUniverseById, selectSelectedMarketMarkedPrice } = perpSlice.selectors
export const perpReducer = perpSlice.reducer
export const perpSelectors = perpSlice.selectors