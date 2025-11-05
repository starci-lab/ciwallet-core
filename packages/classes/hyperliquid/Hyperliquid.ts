import { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import { HyperliquidDepositAsset, type HyperliquidDepositAssetInfo } from "./types"

export enum HyperliquidMarketId {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL",
}

export interface HyperliquidMetadata {
    name: string
    imageUrl: string
}

export class Hyperliquid {
    constructor() {}

    getMarketMetadata(marketId: HyperliquidMarketId): HyperliquidMetadata {
        const map = {
            [HyperliquidMarketId.BTC]: {
                name: "BTC/USDC",
                imageUrl: "/assets/hyperliquid/btc.svg",
            },
            [HyperliquidMarketId.ETH]: {
                name: "ETH/USDC",
                imageUrl: "/assets/hyperliquid/eth.svg",
            },
            [HyperliquidMarketId.SOL]: {
                name: "SOL/USDC",
                imageUrl: "/assets/hyperliquid/sol.svg",
            },
        }
        return map[marketId]
    }

    public getDepositAssetInfos(
    ): Array<HyperliquidDepositAssetInfo> {
        const data: Array<HyperliquidDepositAssetInfo> = [
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Usdc,
                chainIds: [ChainId.Arbitrum],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Btc,
                chainIds: [ChainId.Bsc],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Eth,
                chainIds: [ChainId.Ethereum],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Sol,
                chainIds: [ChainId.Solana],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.TwoZ,
                chainIds: [ChainId.Solana],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Bonk,
                chainIds: [ChainId.Solana],
                tokenId: TokenId.SolanaMainnetUsdc,
            },
        ]
        return data
    }

    public getDepositAssetInfoByAsset(
        asset: HyperliquidDepositAsset
    ): HyperliquidDepositAssetInfo {
        return this.getDepositAssetInfos().find((item) => item.asset === asset)!
    }
}   

export type CandleInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d"