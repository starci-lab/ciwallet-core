import { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import { HyperliquidDepositAsset, type HyperliquidDepositAssetInfo } from "./types"
import * as hl from "@nktkas/hyperliquid"
import { privateKeyToAccount } from "viem/accounts"

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
    private readonly getExchangeClient = (network: Network, privateKey: string) => {
        return new hl.ExchangeClient({
            transport: new hl.HttpTransport({
                isTestnet: network === Network.Testnet,
            }),
            wallet: privateKeyToAccount(privateKey as `0x${string}`),
        })
    }
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

    async approveAgent(
        {
            privateKey,
            accountAddress,
            network,
        }: ApproveAgentParams,
    ): Promise<ApproveAgentResponse> {
        const exchangeClient = this.getExchangeClient(network, privateKey)
        const result = await exchangeClient.approveAgent({
            agentAddress: accountAddress,
            agentName: "NomasWalletHyperliquid",
        })
        if (result.status !== "ok") {
            throw new Error("Failed to approve agent")
        }
        // return "ok" message
        return { status: result.status }
    }
}   

export type CandleInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d"


export interface ApproveAgentParams {
    network: Network
    accountAddress: string
    // we take ethereum private key here because we need to aprrove agent
    privateKey: string
}

export interface ApproveAgentResponse {
    status: string
}
