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
}