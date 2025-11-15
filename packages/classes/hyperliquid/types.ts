import type { ChainId, Network } from "@ciwallet-sdk/types"
import type { TokenId } from "@ciwallet-sdk/types"
import type * as hl from "@nktkas/hyperliquid"

export enum HyperliquidDepositAsset {
    Usdc = "usdc",
    Bitcoin = "btc",
    Eth = "eth",
    Sol = "sol",
    TwoZ = "2z",
    Bonk = "bonk",
    Fartcoin = "fart",
    Pump = "pump",
    Spx = "spx",
    Xpl = "xpl",
}

export interface HyperliquidDepositAssetRef {
    chainId: ChainId
    tokenId: TokenId
}
export interface HyperliquidDepositAssetInfo {
    network: Network
    refs: Array<HyperliquidDepositAssetRef>
    asset: HyperliquidDepositAsset
    iconUrl: string
    name: string
    symbol: string
}

export enum HyperliquidMarketMode {
    Isolated = "isolated",
    CrossMargin = "cross-margin",
}

export enum HyperliquidOrderType {
    Market = "market",
    Limit = "limit",
    StopLimit = "stop-limit",
    StopMarket = "stop-market",
    TakeLimit = "take-limit",
    TakeMarket = "take-market",
    TWAP = "twap",
    Scale = "scale",
}

export interface HyperliquidMarketModeMetadata {
    key: HyperliquidMarketMode
    name: string
    description: string
}

export enum HyperliquidTransport {
    Http = "http",
    Websocket = "websocket",
}

export enum HyperliquidAssetId {
    BTC = "btc",
    ETH = "eth",
    SOL = "sol",
}

export enum HyperliquidOrderSide {
    Buy = "buy",
    Sell = "sell",
}

export type CandleInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d"

export type ActiveAssetData = Awaited<
    ReturnType<
        hl.InfoClient["activeAssetData"]
    >
>

export type ClearingHouseData = Awaited<
    ReturnType<
        hl.InfoClient["clearinghouseState"]
    >
>

export type ActiveAssetCtx = Parameters<
    NonNullable<
        Parameters<
            hl.SubscriptionClient["activeAssetCtx"]
        >[1]
    >
>[0]

export type UserFees = Awaited<
    ReturnType<
        hl.InfoClient["userFees"]
    >
>