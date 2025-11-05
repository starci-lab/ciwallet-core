import type { ChainId, Network } from "@ciwallet-sdk/types"
import type { TokenId } from "@ciwallet-sdk/types"

export type HyperliquidChainId = ChainId | "hyperliquid"
export enum HyperliquidDepositAsset {
    Usdc = "usdc",
    Btc = "btc",
    Eth = "eth",
    Sol = "sol",
    TwoZ = "2z",
    Bonk = "bonk",
    Fartcoin = "fartcoin",
    Pump = "pump",
    Spx = "spx",
    Xpl = "xpl",
}

export interface HyperliquidDepositAssetInfo {
    network: Network
    chainIds: Array<HyperliquidChainId>
    tokenId: TokenId
    asset: HyperliquidDepositAsset
}

