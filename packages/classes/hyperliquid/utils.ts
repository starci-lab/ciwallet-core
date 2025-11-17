import { Network } from "@ciwallet-sdk/types"
import { HyperliquidTransport } from "./types"
import type { IRequestTransport } from "@nktkas/hyperliquid"
import * as hl from "@nktkas/hyperliquid"

export const getRequestTransport = (
    network: Network, 
    transport: HyperliquidTransport
): IRequestTransport => {
    let requestTransport: IRequestTransport
    switch (transport) {
    case HyperliquidTransport.Http:
        requestTransport = new hl.HttpTransport({
            isTestnet: network === Network.Testnet,
        })
        break
    case HyperliquidTransport.Websocket:
        requestTransport = new hl.WebSocketTransport({
            isTestnet: network === Network.Testnet,
        })
        break
    }
    return requestTransport
}