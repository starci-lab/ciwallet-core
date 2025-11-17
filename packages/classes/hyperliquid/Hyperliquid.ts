import { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import { 
    HyperliquidDepositAsset, 
    HyperliquidMarketMode, 
    type HyperliquidDepositAssetInfo, 
    type HyperliquidMarketModeMetadata, 
    HyperliquidAssetId, 
    HyperliquidOrderType
} from "./types"

export enum HyperliquidMarketId {
    BTC = "btc",
    ETH = "eth",
    SOL = "sol",
}

export interface HyperliquidMetadata {
    name: string
    imageUrl: string
    assetId: number
    coin: string
}

export interface HyperliquidOrderTypeMetadata {
    key: HyperliquidOrderType
    name: string
    description: string
}

const map = {
    [HyperliquidAssetId.BTC]: {
        coin: "BTC",
        name: "BTC/USDC",
        imageUrl: "/assets/hyperliquid/btc.svg",
        assetId: 0,
    },
    [HyperliquidAssetId.ETH]: {
        coin: "ETH",
        name: "ETH/USDC",
        imageUrl: "/assets/hyperliquid/eth.png",
        assetId: 1,
    },
    [HyperliquidAssetId.SOL]: {
        coin: "SOL",
        name: "SOL/USDC",
        imageUrl: "/assets/hyperliquid/sol.svg",
        assetId: 2,
    },
}

export class Hyperliquid {
    getModeMetadata() {
        const metadata: Record<HyperliquidMarketMode, HyperliquidMarketModeMetadata> = {
            [HyperliquidMarketMode.Isolated]: {
                key: HyperliquidMarketMode.Isolated,
                name: "Isolated",
                description: "Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of an isolated position reaches 100%, the position will be liquidated. Margin can be added or removed to individual positions in this mode.",
            },
            [HyperliquidMarketMode.CrossMargin]: {
                key: HyperliquidMarketMode.CrossMargin,
                name: "Cross Margin",
                description: "All cross positions share the same cross margin as collateral. In the event of liquidation, your cross margin balance and any remaining open positions under assets in this mode may be forfeited.",
            },
        }
        return metadata
    }

    getOrderTypeMetadata() {
        const metadatas: Record<HyperliquidOrderType, HyperliquidOrderTypeMetadata> = {
            [HyperliquidOrderType.Market]: {
                key: HyperliquidOrderType.Market,
                name: "Market",
                description: "Instantly executes the order at the best available market price.",
            },
            [HyperliquidOrderType.Limit]: {
                key: HyperliquidOrderType.Limit,
                name: "Limit",
                description: "Places an order at a specific price. The order executes only if the market reaches that price.",
            },
            [HyperliquidOrderType.StopLimit]: {
                key: HyperliquidOrderType.StopLimit,
                name: "Stop Limit",
                description: "Triggers a limit order once the market reaches a specified stop price.",
            },
            [HyperliquidOrderType.StopMarket]: {
                key: HyperliquidOrderType.StopMarket,
                name: "Stop Market",
                description: "Triggers a market order once the market reaches a specified stop price.",
            },
            [HyperliquidOrderType.TakeLimit]: {
                key: HyperliquidOrderType.TakeLimit,
                name: "Take Limit",
                description: "Triggers a limit order to take profit when the market reaches a specified price.",
            },
            [HyperliquidOrderType.TakeMarket]: {
                key: HyperliquidOrderType.TakeMarket,
                name: "Take Market",
                description: "Triggers a market order to take profit when the market reaches a specified price.",
            },
            [HyperliquidOrderType.TWAP]: {
                key: HyperliquidOrderType.TWAP,
                name: "TWAP",
                description: "Executes a large order gradually over a specified time period to achieve an average price.",
            },
            [HyperliquidOrderType.Scale]: {
                key: HyperliquidOrderType.Scale,
                name: "Scale",
                description: "Places multiple layered limit orders across a price range to scale into or out of a position.",
            },
        }
        return metadatas
    }

    getAssetMetadatas(): Array<HyperliquidMetadata> {
        return Object.values(map)
    }

    getAssetMetadata(assetId: HyperliquidAssetId): HyperliquidMetadata {
        return map[assetId]
    }

    getAssetMetadataByCoin(coin: string): HyperliquidMetadata {
        const assetId = Object.keys(map).find((key) => map[key as HyperliquidAssetId].coin === coin)
        if (!assetId) {
            throw new Error(`Asset with coin ${coin} not found`)
        }
        return this.getAssetMetadata(assetId as HyperliquidAssetId)
    }

    getAssetIdByCoin(coin: string): HyperliquidAssetId {
        const assetId = Object.keys(map).find((key) => map[key as HyperliquidAssetId].coin === coin)
        if (!assetId) {
            throw new Error(`Asset with coin ${coin} not found`)
        }
        return assetId as HyperliquidAssetId
    }
    
    getAssetIdById(id: number): HyperliquidAssetId {
        const assetId = Object.keys(map).find((key) => map[key as HyperliquidAssetId].assetId === id)
        if (!assetId) {
            throw new Error(`Asset with id ${id} not found`)
        }
        return assetId as HyperliquidAssetId
    }
    getAssetMetadataById(id: number): HyperliquidMetadata {
        return map[this.getAssetIdById(id)]
    }

    public getDepositAssetInfos(
    ): Array<HyperliquidDepositAssetInfo> {
        const data: Array<HyperliquidDepositAssetInfo> = [
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Usdc,
                refs: [
                    {
                        chainId: ChainId.Arbitrum,
                        tokenId: TokenId.ArbitrumMainnetUsdc,
                    },
                ],
                iconUrl: "/assets/tokens/usdc.svg",
                name: "USD Coin",
                symbol: "USDC",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Bitcoin,
                refs: [
                    {
                        chainId: ChainId.Bitcoin,
                        tokenId: TokenId.BitcoinMainnetNative,
                    },
                ],
                iconUrl: "/assets/tokens/bitcoin.svg",
                name: "Bitcoin",
                symbol: "BTC",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Eth,
                refs: [
                    {
                        chainId: ChainId.Ethereum,
                        tokenId: TokenId.EthereumMainnetNative,
                    },
                ],
                iconUrl: "/assets/tokens/ethereum.png",
                name: "Ethereum",
                symbol: "ETH",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Sol,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnetUsdc,
                    },
                ],
                iconUrl: "/assets/tokens/solana.png",
                name: "Solana",
                symbol: "SOL",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.TwoZ,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnet2Z,
                    },
                ],
                iconUrl: "/assets/tokens/2z.svg",
                name: "2Z",
                symbol: "2Z",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Bonk,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnetBonk,
                    },
                ],
                iconUrl: "/assets/tokens/bonk.svg",
                name: "Bonk",
                symbol: "BONK",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Fartcoin,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnetFartcoin,
                    },
                ],
                iconUrl: "/assets/tokens/fartcoin.svg",
                name: "Fartcoin",
                symbol: "FART",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Pump,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnetPump,
                    },
                ],
                iconUrl: "/assets/tokens/pump.svg",
                name: "Pump",
                symbol: "PUMP",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Spx,
                refs: [
                    {
                        chainId: ChainId.Solana,
                        tokenId: TokenId.SolanaMainnetSpx,
                    },
                ],
                iconUrl: "/assets/tokens/spx.svg",
                name: "SPX6900",
                symbol: "SPX",
            },
            {
                network: Network.Mainnet,
                asset: HyperliquidDepositAsset.Xpl,
                refs: [
                    {
                        chainId: ChainId.Plasma,
                        tokenId: TokenId.PlasmaMainnetNative,
                    },
                ],
                iconUrl: "/assets/tokens/xpl.jpg",
                name: "Plasma",
                symbol: "XPL",
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

export interface ApproveAgentParams {
    network: Network
    accountAddress: string
    // we take ethereum private key here because we need to aprrove agent
    privateKey: string
}

export interface ApproveAgentResponse {
    status: string
}
