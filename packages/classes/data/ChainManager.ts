import { ChainId, Network, type ChainMetadata } from "@ciwallet-sdk/types"

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
            iconUrl: "/icons/chains/aptos.svg",
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
