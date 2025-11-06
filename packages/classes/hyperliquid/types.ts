import type { Network } from "@ciwallet-sdk/types"
import type { TokenId } from "@ciwallet-sdk/types"

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
    chainIds: Array<ChainId>
    tokenId: TokenId
    asset: HyperliquidDepositAsset
}

