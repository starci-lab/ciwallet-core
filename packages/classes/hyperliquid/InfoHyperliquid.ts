import * as hl from "@nktkas/hyperliquid"
import { HyperliquidAssetId, HyperliquidTransport, type CandleInterval } from "./types"
import { getRequestTransport } from "./utils"
import { Hyperliquid } from "./Hyperliquid"
import { Network } from "@ciwallet-sdk/types"

export interface InfoHyperliquidAllPerpMetasParams {
    clientParams: InfoHyperliquidClientParams
}
export interface InfoHyperliquidClientParams {
    network: Network
}
export interface InfoHyperliquidCandleSnapshotParams {
    clientParams: InfoHyperliquidClientParams
    assetId: HyperliquidAssetId
    interval: CandleInterval
    startTime: number
}
export class InfoHyperliquid {
    private readonly hyperliquidObj: Hyperliquid
    constructor() {
        this.hyperliquidObj = new Hyperliquid()
    }
    // we get exchange client for http or websocket
    getInfoClient ({ network }: InfoHyperliquidClientParams) {
        return new hl.InfoClient({
            transport: getRequestTransport(network, HyperliquidTransport.Http),
        })
    }

    async allPerpMetas(
        {
            clientParams,
        }: InfoHyperliquidAllPerpMetasParams
    ) {
        const client = this.getInfoClient({ 
            ...clientParams, 
        })
        return await client.allPerpMetas()
    }

    async candleSnapshot(
        {
            clientParams,
            assetId,
            interval,
            startTime,
        }: InfoHyperliquidCandleSnapshotParams
    ) {
        const client = this.getInfoClient({ 
            ...clientParams, 
        })
        const metadata = this.hyperliquidObj.getAssetMetadata(assetId)
        return await client.candleSnapshot({
            coin: metadata.coin,
            interval,
            startTime,
        })
    }

    async openOrders(
        {
            clientParams,
            userAddress,
        }: InfoHyperliquidOpenOrdersParams
    ) {
        const client = this.getInfoClient({ 
            ...clientParams, 
        })
        return await client.openOrders({
            user: userAddress,
        })
    }

    async getActiveAssetData(
        {
            clientParams,
            assetId,
            userAddress,
        }: InfoHyperliquidGetActiveAssetDataParams
    ) {
        const client = this.getInfoClient({ 
            ...clientParams, 
        })
        return await client.activeAssetData({
            coin: this.hyperliquidObj.getAssetMetadata(assetId).coin,
            user: userAddress,
        })
    }

    async getClearingHouseData(
        {
            clientParams,
            accountAddress,
        }: InfoHyperliquidGetClearingHouseDataParams
    ) {
        const client = this.getInfoClient({ 
            ...clientParams, 
        })
        return await client.clearinghouseState({
            user: accountAddress,
        })
    }
}

export interface InfoHyperliquidOpenOrdersParams {
    clientParams: InfoHyperliquidClientParams
    userAddress: string
}

export interface InfoHyperliquidGetActiveAssetDataParams {
    clientParams: InfoHyperliquidClientParams
    assetId: HyperliquidAssetId
    userAddress: string
}

export interface InfoHyperliquidGetClearingHouseDataParams {
    clientParams: InfoHyperliquidClientParams
    accountAddress: string
}