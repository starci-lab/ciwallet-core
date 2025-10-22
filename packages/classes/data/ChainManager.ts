import { ChainId, Network, type ChainMetadata, Platform } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export class ChainManager {
    private defaultChains: Array<ChainMetadata> = [
        {
            id: ChainId.Monad,
            name: "Monad",
            iconUrl: "/icons/chains/monad.png",
            iconInvertedUrl: "/icons/chains/monad-inverted.png",
            explorerUrl: {
                [Network.Mainnet]: "https://testnet.monadexplorer.com/",
                [Network.Testnet]: "https://testnet.monadexplorer.com/",
            },
        },
        {
            id: ChainId.Aptos,
            name: "Aptos",
            iconUrl: "/icons/chains/aptos.png",
            iconInvertedUrl: "/icons/chains/aptos-inverted.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://aptos.network",
                [Network.Testnet]: "https://aptos.network",
            },
        },
        {
            id: ChainId.Sui,
            name: "Sui",
            iconUrl: "/icons/chains/sui.jpeg",
            iconInvertedUrl: "/icons/chains/sui-inverted.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://sui.network",
                [Network.Testnet]: "https://sui.network",
            },
        },
        {
            id: ChainId.Solana,
            name: "Solana",
            iconUrl: "/icons/chains/solana.png",
            explorerUrl: {
                [Network.Mainnet]: "https://solana.network",
                [Network.Testnet]: "https://solana.network",
            },
        },
        {
            id: ChainId.Bsc,
            name: "BSC",
            iconUrl: "/icons/chains/bsc.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://bsc.network",
                [Network.Testnet]: "https://bsc.network",
            },
        },
        {
            id: ChainId.Polygon,
            name: "Polygon",
            iconUrl: "/icons/chains/polygon.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://polygon.network",
                [Network.Testnet]: "https://polygon.network",
            },
        },
        {
            id: ChainId.Ethereum,
            name: "Ethereum",
            iconUrl: "/icons/chains/ethereum.png",
            explorerUrl: {
                [Network.Mainnet]: "https://etherscan.io",
                [Network.Testnet]: "https://etherscan.io",
            },
        },
        {
            id: ChainId.Avalanche,
            name: "Avalanche",
            iconUrl: "/icons/chains/avalanche.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://snowtrace.io",
                [Network.Testnet]: "https://snowtrace.io",
            },
        },
        {
            id: ChainId.Fantom,
            name: "Fantom",
            iconUrl: "/icons/chains/fantom.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://ftmscan.com",
                [Network.Testnet]: "https://ftmscan.com",
            },
        },
        {
            id: ChainId.Arbitrum,
            name: "Arbitrum",
            iconUrl: "/icons/chains/arbitrum.png",
            explorerUrl: {
                [Network.Mainnet]: "https://arbiscan.io",
                [Network.Testnet]: "https://arbiscan.io",
            },
        },
        {
            id: ChainId.Base,
            name: "Base",
            iconUrl: "/icons/chains/base.svg",
            explorerUrl: {
                [Network.Mainnet]: "https://basescan.org",
                [Network.Testnet]: "https://basescan.org",
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
}
