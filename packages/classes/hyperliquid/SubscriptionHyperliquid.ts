import * as hl from "@nktkas/hyperliquid"
import type { ActiveAssetData, ClearingHouseData, HyperliquidAssetId } from "./types"
import type { CandleInterval } from "./types"
import { type ElementOf, Network } from "@ciwallet-sdk/types"
import { Hyperliquid } from "./Hyperliquid" 
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

export class SubscriptionHyperliquid {
    private readonly hyperliquidObj: Hyperliquid
    constructor() {
        this.hyperliquidObj = new Hyperliquid()
    }

    async subscribeToAllMids(
        {
            client,
            onUpdate,
        }: SubscriptionHyperliquidSubscribeToAllMidsParams
    ) {
        await client.allMids((event) => {
            onUpdate(event)
        })
    }

    async subscribeToCandle(
        {
            client,
            onUpdate,
            assetId,
            interval,
        }: SubscriptionHyperliquidSubscribeToCandleParams
    ) {
        const metadata = this.hyperliquidObj.getAssetMetadata(assetId)
        await client.candle({
            coin: metadata.coin,
            interval: interval,
        }, (event) => {
            onUpdate(event)
        })
    }

    async subscribeToClearingHouseData(
        {
            client,
            onUpdate,
            userAddress,
        }: SubscriptionHyperliquidSubscribeToClearingHouseDataParams
    ) {
        await client.clearinghouseState({
            user: userAddress,
        }, (event) => {
            onUpdate(event.clearinghouseState)
        })
    }

    async subscribeToActiveAssetData(
        {
            client,
            onUpdate,
            assetId,
            userAddress,
        }: SubscriptionHyperliquidSubscribeToActiveAssetDataParams
    ) {
        await client.activeAssetData({
            coin: this.hyperliquidObj.getAssetMetadata(assetId).coin,
            user: userAddress,
        }, (event) => {
            onUpdate(event)
        })
    }

    getSubscriptionClient(
        {
            network,
        }: SubscriptionHyperliquidGetSubscriptionClientParams
    ) {
        return new hl.SubscriptionClient({
            transport: new hl.WebSocketTransport({
                isTestnet: network === Network.Testnet,
            }),
        })
    }
}

export interface SubscriptionHyperliquidSubscribeToAllMidsParams {
    client: hl.SubscriptionClient
    onUpdate: (event: AllMids) => void
}
export interface SubscriptionHyperliquidSubscribeToCandleParams {
    client: hl.SubscriptionClient
    onUpdate: (event: ElementOf<CandleSnapshots>) => void
    assetId: HyperliquidAssetId
    interval: CandleInterval
}
export interface SubscriptionHyperliquidGetSubscriptionClientParams {
    network: Network
}

export interface SubscriptionHyperliquidSubscribeToActiveAssetDataParams {
    client: hl.SubscriptionClient
    onUpdate: (event: ActiveAssetData) => void
    userAddress: string
    assetId: HyperliquidAssetId
}

export interface SubscriptionHyperliquidSubscribeToClearingHouseDataParams {
    client: hl.SubscriptionClient
    onUpdate: (event: ClearingHouseData) => void
    userAddress: string
}