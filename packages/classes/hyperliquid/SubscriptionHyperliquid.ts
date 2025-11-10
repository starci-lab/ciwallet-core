import * as hl from "@nktkas/hyperliquid"
import type { HyperliquidAssetId } from "./types"
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