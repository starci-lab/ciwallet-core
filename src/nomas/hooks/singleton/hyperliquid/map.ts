import { assetsConfig } from "@/nomas/resources"
import { HyperliquidAssetId } from "@ciwallet-sdk/classes"
export interface HyperliquidMetadata {
    name: string
    imageUrl: string
}

export const getHyperliquidMetadata = (marketId: HyperliquidAssetId) => {
    const metadata: Record<HyperliquidAssetId, HyperliquidMetadata> = {
        [HyperliquidAssetId.BTC]: {
            name: "BTC/USDC",
            imageUrl: assetsConfig().hyperliquid.btc,
        },
        [HyperliquidAssetId.ETH]: {
            name: "ETH/USDC",
            imageUrl: assetsConfig().hyperliquid.eth,
        },
        [HyperliquidAssetId.SOL]: {
            name: "SOL/USDC",
            imageUrl: assetsConfig().hyperliquid.sol,
        },
    }
    return metadata[marketId]
}