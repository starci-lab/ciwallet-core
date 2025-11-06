import { ChainId, Network, type ChainMetadata, Platform, type PlatformMetadata } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export class ChainManager {
    private defaultChains: Array<ChainMetadata> = [
        {
            id: ChainId.Monad,
            name: "Monad",
            iconUrl: "/assets/chains/monad.png",
            iconInvertedUrl: "/assets/chains/monad-inverted.png",
            explorerUrl: {
                [Network.Mainnet]: "https://testnet.monadexplorer.com/",
                [Network.Testnet]: "https://testnet.monadexplorer.com/",
            },
        },
        {
            id: ChainId.Hyperliquid,
            name: "Hyperliquid",
            iconUrl: "/assets/chains/hyperliquid.webp",
            explorerUrl: {
                [Network.Mainnet]: "https://rpc.hyperliquid.xyz/evm",
                [Network.Testnet]: "https://rpc.hyperliquid-testnet.xyz/evm",
            },
        },
        {
            id: ChainId.Arbitrum,
            name: "Arbitrum",
            iconUrl: "/assets/chains/arbitrum.png",
            explorerUrl: {
                [Network.Mainnet]: "https://arbiscan.io",
                [Network.Testnet]: "https://sepolia.arbiscan.io/",
            },
        },
        {
            id: ChainId.Aptos,
            name: "Aptos",
            iconUrl: "/assets/chains/aptos.png",
            iconInvertedUrl: "/assets/chains/aptos-inverted.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://aptos.network",
                [Network.Testnet]: "https://aptos.network",
            },
        },
        {
            id: ChainId.Sui,
            name: "Sui",
            iconUrl: "/assets/chains/sui.jpeg",
            iconInvertedUrl: "/assets/chains/sui-inverted.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://sui.network",
                [Network.Testnet]: "https://sui.network",
            },
        },
        {
            id: ChainId.Solana,
            name: "Solana",
            iconUrl: "/assets/chains/solana.png",
            explorerUrl: {
                [Network.Mainnet]: "https://solana.network",
                [Network.Testnet]: "https://solana.network",
            },
        },
        {
            id: ChainId.Bsc,
            name: "BSC",
            iconUrl: "/assets/chains/bsc.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://bsc.network",
                [Network.Testnet]: "https://bsc.network",
            },
        },
        {
            id: ChainId.Polygon,
            name: "Polygon",
            iconUrl: "/assets/chains/polygon.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://polygon.network",
                [Network.Testnet]: "https://polygon.network",
            },
        },
        {
            id: ChainId.Ethereum,
            name: "Ethereum",
            iconUrl: "/assets/chains/ethereum.png",
            explorerUrl: {
                [Network.Mainnet]: "https://etherscan.io",
                [Network.Testnet]: "https://etherscan.io",
            },
        },
        {
            id: ChainId.Avalanche,
            name: "Avalanche",
            iconUrl: "/assets/chains/avalanche.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://snowtrace.io",
                [Network.Testnet]: "https://snowtrace.io",
            },
        },
        {
            id: ChainId.Fantom,
            name: "Fantom",
            iconUrl: "/assets/chains/fantom.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://ftmscan.com",
                [Network.Testnet]: "https://ftmscan.com",
            },
        },
        {
            id: ChainId.Base,
            name: "Base",
            iconUrl: "/assets/chains/base.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://basescan.org",
                [Network.Testnet]: "https://basescan.org",
            },
        },
        {
            id: ChainId.Bitcoin,
            name: "Bitcoin",
            iconUrl: "/assets/chains/bitcoin.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://blockstream.info",
                [Network.Testnet]: "https://blockstream.info",
            },
        },
        {
            id: ChainId.Plasma,
            name: "Plasma",
            iconUrl: "/assets/chains/plasma.jpg",
            explorerUrl: {
                [Network.Mainnet]: "https://plasma.to",
                [Network.Testnet]: "https://plasma.to",
            },
        },
    ]
    private chains: Array<ChainMetadata> = []

    constructor() {
        this.chains = this.defaultChains
    }

    public toObject(): Array<ChainMetadata> {
        return this.chains
    }

    public getPlatformDescriptions(platform: Platform): string {
        switch (platform) {
        case Platform.Evm:
            return " Uses standard 64-hex private keys (secp256k1), compatible with MetaMask and most EVM wallets."
        case Platform.Solana:
            return "Uses 64-byte Ed25519 secret keys (base58 or JSON array), not compatible with EVM keys."
        case Platform.Sui:
            return "Uses Ed25519 or Secp256r1 private keys with Sui-specific encoding (0x{...} prefix)."
        case Platform.Aptos:
            return "Uses Ed25519 private keys derived from mnemonic or 32-byte hex string."
        case Platform.Bitcoin:
            return "Uses 32-byte private keys derived from mnemonic or 32-byte hex string."
        default:
            return ""
        }
    }

    public getChainById(id: ChainId): ChainMetadata | undefined {
        return this.chains.find(chain => chain.id === id)
    }

    public getChainsByPlatform(platform: Platform): Array<ChainMetadata> {
        return this.chains.filter(chain => chainIdToPlatform(chain.id) === platform)
    }

    public getTransactionDetails(txHash: string, chainId: ChainId): string {
        if (!txHash) return ""
        const chain = this.getChainById(chainId)
        switch (chainId) {
        case ChainId.Monad:
            return `https://monad-testnet.socialscan.io/tx/${txHash}`
        case ChainId.Aptos:
            return `${chain?.explorerUrl[Network.Testnet]}/transactions/${txHash}`
        case ChainId.Sui:
            return `https://solscan.io/tx/${txHash}`
        case ChainId.Solana:
            return `${chain?.explorerUrl[Network.Testnet]}/tx/${txHash}`
        default:
            return ""
        }
    }

    public injectIconUrl(options: {
        chainId?: ChainId
        iconUrl?: string
        iconInvertedUrl?: string
    }) {
        const { chainId, iconUrl, iconInvertedUrl } = options

        // If a specific chainId is provided → update only that chain
        if (chainId) {
            const chain = this.getChainById(chainId)
            if (!chain) return
            if (iconUrl) chain.iconUrl = iconUrl
            if (iconInvertedUrl) chain.iconInvertedUrl = iconInvertedUrl
            return
        }

        // If no chainId provided → apply updates globally for all chains
        for (const chain of this.chains) {
            if (iconUrl) chain.iconUrl = iconUrl
            if (iconInvertedUrl) chain.iconInvertedUrl = iconInvertedUrl
        }
    }

    public getPlatformMetadatas(): Array<PlatformMetadata> {
        return [
            {
                platform: Platform.Evm,
                name: "EVM Networks",
                symbol: "EVM",
            },
            {
                platform: Platform.Solana,
                name: "Solana Networks",
                symbol: "Solana",
            },
            {
                platform: Platform.Sui,
                name: "Sui Networks",
                symbol: "Sui",
            },
            {
                platform: Platform.Aptos,
                name: "Aptos Networks",
                symbol: "Aptos",
            },
            {
                platform: Platform.Bitcoin,
                name: "Bitcoin Networks",
                symbol: "Bitcoin",
            },
        ]
    }

    public getPlatformMetadata(platform: Platform): PlatformMetadata {
        const metadata = this.getPlatformMetadatas().find(metadata => metadata.platform === platform)
        if (!metadata) throw new Error(`Platform metadata not found for platform: ${platform}`)
        return metadata
    }
}