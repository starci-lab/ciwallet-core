import type { ChainId, Network } from "@ciwallet-sdk/types"
import type { TokenId } from "@ciwallet-sdk/types"

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

