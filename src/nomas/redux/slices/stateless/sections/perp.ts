import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { 
    HyperliquidAssetId, 
    HyperliquidOrderType, 
    type CandleInterval, 
    type PerpMetas, 
    type AllMids, 
    type CandleSnapshots, 
    type ActiveAssetData,
    type ClearingHouseData,
    HyperliquidOrderSide,
    type ActiveAssetCtx,
    type UserFees,
    type OpenOrders
} from "@ciwallet-sdk/classes"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { hyperliquidObj } from "@/nomas/obj"
import type { ElementOf } from "@ciwallet-sdk/types"

export enum PerpSectionPage {
    Perp = "perp",
    Deposit = "deposit",
    SelectAsset = "select-asset",
    SourceChain = "source-chain",
    MarginMode = "margin-mode",
    Leverage = "leverage",
    OrderType = "order-type",
    LongShort = "long-short",
    TakeProfitStopLoss = "take-profit-stop-loss",
    Position = "position",
    ClosePositionConfirmation = "close-position-confirmation",
    Order = "order",
}

export enum PerpTab {
    Trade = "trade",
    Assets = "assets",
    Orders = "orders",
}

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
    selectedAssetId: HyperliquidAssetId;
    candleSnapshots: CandleSnapshots;
    candleInterval: CandleInterval;
    candleStartTime: number;
    hyperunitGenResponse: Partial<Record<HyperliquidDepositAsset, HyperunitGenResponse>>;
    activeAssetData?: ActiveAssetData;
    clearingHouseData?: ClearingHouseData;
    leverage: number;
    isCross: boolean;
    orderType: HyperliquidOrderType;
    orderSide: HyperliquidOrderSide;
    activeAssetCtx?: ActiveAssetCtx;
    userFees?: UserFees;
    positionAssetId: HyperliquidAssetId;
    positionAssetCtx?: ActiveAssetCtx;
    positionCandleSnapshots: CandleSnapshots;
    positionUseUsdc: boolean;
    openOrders: OpenOrders;
    selectedOrder?: ElementOf<OpenOrders>;
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
    selectedAssetId: HyperliquidAssetId.BTC,
    candleSnapshots: [],
    candleInterval: "4h",
    candleStartTime: Date.now(),
    hyperunitGenResponse: {},
    leverage: 1,
    isCross: false,
    orderSide: HyperliquidOrderSide.Buy,
    orderType: HyperliquidOrderType.Market,
    positionAssetId: HyperliquidAssetId.BTC,
    positionCandleSnapshots: [],
    positionUseUsdc: false,
    openOrders: [],
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
        setPositionCandleSnapshots: (state, action: PayloadAction<CandleSnapshots>) => {
            state.positionCandleSnapshots = action.payload
        },
        setAllMids: (state, action: PayloadAction<AllMids>) => {
            state.allMids = action.payload
        },
        setSelectedAssetId: (state, action: PayloadAction<HyperliquidAssetId>) => {
            state.selectedAssetId = action.payload
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
        setLastPositionCandleSnapshot: (state, action: PayloadAction<CandleSnapshots[number]>) => {
            state.positionCandleSnapshots[state.positionCandleSnapshots.length - 1] = action.payload
        },
        setHyperunitGenResponse: (state, action: PayloadAction<SetHyperunitGenResponseParam>) => {
            state.hyperunitGenResponse[action.payload.asset] = action.payload.response
        },
        setApprovedAgent: (state, action: PayloadAction<boolean>) => {
            state.approvedAgent = action.payload
        },
        setSelectedOrder: (state, action: PayloadAction<ElementOf<OpenOrders>>) => {
            state.selectedOrder = action.payload
        },
        setActiveAssetData: (state, action: PayloadAction<ActiveAssetData>) => {
            state.activeAssetData = action.payload
        },
        setClearingHouseData: (state, action: PayloadAction<ClearingHouseData>) => {
            state.clearingHouseData = action.payload
        },
        setLeverage: (state, action: PayloadAction<number>) => {
            state.leverage = action.payload
        },
        setIsCross: (state, action: PayloadAction<boolean>) => {
            state.isCross = action.payload
        },
        setOrderSide: (state, action: PayloadAction<HyperliquidOrderSide>) => {
            state.orderSide = action.payload
        },
        setOrderType: (state, action: PayloadAction<HyperliquidOrderType>) => {
            state.orderType = action.payload
        },
        setActiveAssetCtx: (state, action: PayloadAction<ActiveAssetCtx>) => {
            state.activeAssetCtx = action.payload
        },
        setPositionAssetCtx: (state, action: PayloadAction<ActiveAssetCtx>) => {
            state.positionAssetCtx = action.payload
        },
        setUserFees: (state, action: PayloadAction<UserFees>) => {
            state.userFees = action.payload
        },
        setPositionAssetId: (state, action: PayloadAction<HyperliquidAssetId>) => {
            state.positionAssetId = action.payload
        },
        setPositionUseUsdc: (state, action: PayloadAction<boolean>) => {
            state.positionUseUsdc = action.payload
        },
        setOpenOrders: (state, action: PayloadAction<OpenOrders>) => {
            state.openOrders = action.payload
        },
    },
    selectors: {
        selectPerpUniverses: (state) => {
            return Object.values(state.perpMetas).flatMap((perpMeta) => perpMeta.universe)
        },
        selectPerpUniverseById: (state) => {
            const metadata = hyperliquidObj.getAssetMetadata(state.selectedAssetId)
            const universes = Object.values(state.perpMetas).flatMap((perpMeta) => perpMeta.universe)
            return universes.find((universe) => universe.name === metadata.coin)
        },
        selectMarginTableByUniverseId: (state) => {
            const metadata = hyperliquidObj.getAssetMetadata(state.selectedAssetId)
            const universes = Object.values(state.perpMetas).flatMap((perpMeta) => perpMeta.universe)
            const universe = universes.find((universe) => universe.name === metadata.coin)
            const marginTables = state.perpMetas.flatMap((perpMeta) => perpMeta.marginTables)
            return marginTables.find(([id]) => id === universe?.marginTableId)?.[1]
        },
        selectSelectedAssetPrice: (state) => {
            return state.allMids?.mids[state.selectedAssetId]
        },
        selectSelectedOrder: (state) => {
            return state.selectedOrder
        },
    },
})

export const { 
    setPerpTab, 
    setPerpSectionPage, 
    setPerpMetas, 
    setAllMids, 
    setSelectedAssetId, 
    setCandleSnapshots, 
    setCandleInterval, 
    setCandleStartTime, 
    setLastCandleSnapshot, 
    setLastPositionCandleSnapshot,
    setPositionCandleSnapshots,
    setActiveAssetCtx,
    setPositionAssetCtx,
    setHyperunitGenResponse, 
    setApprovedAgent,
    setActiveAssetData,
    setClearingHouseData,
    setLeverage,
    setIsCross,
    setOrderSide,
    setOrderType,
    setUserFees,
    setPositionAssetId,
    setPositionUseUsdc,
    setOpenOrders,
    setSelectedOrder,
} = perpSlice.actions
export const { selectPerpUniverses, selectPerpUniverseById, selectSelectedAssetPrice, selectMarginTableByUniverseId, selectSelectedOrder } = perpSlice.selectors
export const perpReducer = perpSlice.reducer
export const perpSelectors = perpSlice.selectors