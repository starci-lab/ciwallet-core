import { Network } from "@ciwallet-sdk/types"
import * as hl from "@nktkas/hyperliquid"
import { privateKeyToAccount } from "viem/accounts"
import { HyperliquidAssetId, HyperliquidTransport } from "./types"
import { getRequestTransport } from "./utils"
import { Hyperliquid } from "./Hyperliquid"

export interface ExchangeHyperliquidClientParams {
    network: Network
    privateKey: string
    transport: HyperliquidTransport
}

export type HttpExchangeHyperliquidClientParams = Omit<ExchangeHyperliquidClientParams, "transport">
export type WebsocketExchangeHyperliquidClientParams = Omit<ExchangeHyperliquidClientParams, "transport">

export interface UpdateLeverageResponse {
    status: string
}

export interface HyperliquidUpdateLeverageParams {
    asset: HyperliquidAssetId
    leverage: string | number
    isCross: boolean
    clientParams: HttpExchangeHyperliquidClientParams
}

export interface HyperliquidApproveAgentParams {
    agentAddress: string
    clientParams: HttpExchangeHyperliquidClientParams
}

export class ExchangeHyperliquid {
    private readonly hyperliquidObj: Hyperliquid
    constructor() {
        this.hyperliquidObj = new Hyperliquid()
    }
    // we get exchange client for http or websocket
    getExchangeClient ({ network, privateKey, transport }: ExchangeHyperliquidClientParams) {
        return new hl.ExchangeClient({
            transport: getRequestTransport(network, transport),
            wallet: privateKeyToAccount(`0x${privateKey}`),
        })
    }
    // we update the leverage for the given asset
    async updateLeverage(
        { 
            asset, 
            leverage, 
            isCross, 
            clientParams 
        }: HyperliquidUpdateLeverageParams
    ): Promise<UpdateLeverageResponse> {
        const client = this.getExchangeClient({ 
            ...clientParams, 
            transport: HyperliquidTransport.Http 
        })
        const assetMetadata = this.hyperliquidObj.getAssetMetadata(asset)
        return await client.updateLeverage({
            asset: assetMetadata.assetId,
            leverage: leverage,
            isCross: isCross,
        })
    }
    
    async approveAgent(
        {
            clientParams,
            agentAddress,
        }: HyperliquidApproveAgentParams
    ) {
        const client = this.getExchangeClient({ 
            ...clientParams, 
            transport: HyperliquidTransport.Http 
        })
        return await client.approveAgent({
            agentAddress: agentAddress,
            agentName: "NomasWalletHyperliquid",
        })
    }
}