import { ChainId, Network } from "@ciwallet-sdk/types"

export enum ExplorerId {
    Etherscan = "etherscan",
    Bscscan = "bscscan",
    Polygonscan = "polygonscan",
    Arbiscan = "arbiscan",
    Snowtrace = "snowtrace",
    Ftmscan = "ftmscan",
    Base = "base",
    Avalanche = "avalanche",
    Fantom = "fantom",
    MonVision = "monvision",
    SolanaExplorer = "solana-explorer",
    SuiExplorer = "sui-explorer",
    AptosExplorer = "aptos-explorer",
}

export interface ExplorerData {
    id: ExplorerId
    name: string
    chainId: ChainId
    urls: Partial<Record<Network, string>>
    addressUrlBuilder: (address: string, network: Network) => string
    transactionUrlBuilder: (txHash: string, network: Network) => string
}

export class ExplorerManager {
    private explorers: Partial<Record<ExplorerId, ExplorerData>> = {}
    private chainToExplorer: Partial<Record<ChainId, ExplorerId>> = {}

    constructor() {
        // EVM-based explorers
        this.explorers = {
            [ExplorerId.Etherscan]: {
                id: ExplorerId.Etherscan,
                name: "Etherscan",
                chainId: ChainId.Ethereum,
                urls: {
                    mainnet: "https://etherscan.io",
                    testnet: "https://sepolia.etherscan.io",
                },
                addressUrlBuilder: (address, network) =>
                    `${network === "testnet" ? "https://sepolia.etherscan.io" : "https://etherscan.io"}/address/${address}`,
                transactionUrlBuilder: (txHash, network) =>
                    `${network === "testnet" ? "https://sepolia.etherscan.io" : "https://etherscan.io"}/tx/${txHash}`,
            },
            [ExplorerId.Bscscan]: {
                id: ExplorerId.Bscscan,
                name: "BscScan",
                chainId: ChainId.Bsc,
                urls: {
                    mainnet: "https://bscscan.com",
                    testnet: "https://testnet.bscscan.com",
                },
                addressUrlBuilder: (address, network) =>
                    `${network === "testnet" ? "https://testnet.bscscan.com" : "https://bscscan.com"}/address/${address}`,
                transactionUrlBuilder: (txHash, network) =>
                    `${network === "testnet" ? "https://testnet.bscscan.com" : "https://bscscan.com"}/tx/${txHash}`,
            },
            [ExplorerId.Polygonscan]: {
                id: ExplorerId.Polygonscan,
                name: "PolygonScan",
                chainId: ChainId.Polygon,
                urls: {
                    mainnet: "https://polygonscan.com",
                    testnet: "https://mumbai.polygonscan.com",
                },
                addressUrlBuilder: (address, network) =>
                    `${network === "testnet" ? "https://mumbai.polygonscan.com" : "https://polygonscan.com"}/address/${address}`,
                transactionUrlBuilder: (txHash, network) =>
                    `${network === "testnet" ? "https://mumbai.polygonscan.com" : "https://polygonscan.com"}/tx/${txHash}`,
            },
            [ExplorerId.MonVision]: {
                id: ExplorerId.MonVision,
                name: "MonVision",
                chainId: ChainId.Monad,
                urls: {
                    mainnet: "https://monadscan.io",
                    testnet: "https://testnet.monadscan.io",
                },
                addressUrlBuilder: (address, network) =>
                    `${network === "testnet" ? "https://testnet.monadscan.io" : "https://monadscan.io"}/address/${address}`,
                transactionUrlBuilder: (txHash, network) =>
                    `${network === "testnet" ? "https://testnet.monadscan.io" : "https://monadscan.io"}/tx/${txHash}`,
            },

            // Non-EVM explorers
            [ExplorerId.SolanaExplorer]: {
                id: ExplorerId.SolanaExplorer,
                name: "Solana Explorer",
                chainId: ChainId.Solana,
                urls: {
                    mainnet: "https://solscan.io",
                    testnet: "https://solscan.io/?cluster=testnet",
                },
                addressUrlBuilder: (address, network) =>
                    network === "mainnet"
                        ? `https://solscan.io/account/${address}`
                        : `https://solscan.io/account/${address}?cluster=${network}`,
                transactionUrlBuilder: (txHash, network) =>
                    network === "mainnet"
                        ? `https://solscan.io/tx/${txHash}`
                        : `https://solscan.io/tx/${txHash}?cluster=${network}`,
            },
            [ExplorerId.SuiExplorer]: {
                id: ExplorerId.SuiExplorer,
                name: "Sui Explorer",
                chainId: ChainId.Sui,
                urls: {
                    mainnet: "https://suiscan.xyz/mainnet",
                    testnet: "https://suiscan.xyz/testnet",
                },
                addressUrlBuilder: (address, network) =>
                    `https://suiscan.xyz/${network}/address/${address}`,
                transactionUrlBuilder: (txHash, network) =>
                    `https://suiscan.xyz/${network}/tx/${txHash}`,
            },
            [ExplorerId.AptosExplorer]: {
                id: ExplorerId.AptosExplorer,
                name: "Aptos Explorer",
                chainId: ChainId.Aptos,
                urls: {
                    mainnet: "https://explorer.aptoslabs.com",
                    testnet: "https://explorer.aptoslabs.com/?network=testnet",
                },
                addressUrlBuilder: (address, network) =>
                    network === "mainnet"
                        ? `https://explorer.aptoslabs.com/account/${address}`
                        : `https://explorer.aptoslabs.com/account/${address}?network=${network}`,
                transactionUrlBuilder: (txHash, network) =>
                    network === "mainnet"
                        ? `https://explorer.aptoslabs.com/txn/${txHash}`
                        : `https://explorer.aptoslabs.com/txn/${txHash}?network=${network}`,
            },
        }
    }

    getExplorerById(id: ExplorerId): ExplorerData | undefined {
        return this.explorers[id]
    }

    getExplorerByChain(chainId: ChainId): ExplorerData | undefined {
        const explorerId = this.chainToExplorer[chainId]
        return explorerId ? this.getExplorerById(explorerId) : undefined
    }

    getAddressUrl(chainId: ChainId, address: string, network: Network): string | undefined {
        const explorer = this.getExplorerByChain(chainId)
        return explorer?.addressUrlBuilder(address, network)
    }

    getTransactionUrl(explorerId: ExplorerId, txHash: string, network: Network): string | undefined {
        const explorer = this.getExplorerById(explorerId)
        return explorer?.transactionUrlBuilder(txHash, network)
    }
    getExplorerName(explorerId: ExplorerId): string | undefined {
        const explorer = this.getExplorerById(explorerId)
        return explorer?.name
    }
}