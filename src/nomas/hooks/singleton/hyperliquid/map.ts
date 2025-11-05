import { assetsConfig } from "@/nomas/resources"

export interface HyperliquidMetadata {
    name: string
    imageUrl: string
}

export enum HyperliquidMarketId {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL",
}
export const getHyperliquidMetadata = (marketId: HyperliquidMarketId) => {
    const metadata: Record<HyperliquidMarketId, HyperliquidMetadata> = {
        [HyperliquidMarketId.BTC]: {
            name: "BTC/USDC",
            imageUrl: assetsConfig().hyperliquid.btc,
        },
        [HyperliquidMarketId.ETH]: {
            name: "ETH/USDC",
            imageUrl: assetsConfig().hyperliquid.eth,
        },
        [HyperliquidMarketId.SOL]: {
            name: "SOL/USDC",
            imageUrl: assetsConfig().hyperliquid.sol,
        },
    }
    return metadata[marketId]
}