export enum ChainId {
    Monad = "monad",
    Solana = "solana",
    Sui = "sui",
    Aptos = "aptos",
    Bsc = "bsc",
    Polygon = "polygon",
    Ethereum = "ethereum",
    Avalanche = "avalanche",
    Fantom = "fantom",
    Arbitrum = "arbitrum",
    Base = "base",
}

export enum Network {
    Mainnet = "mainnet",
    Testnet = "testnet",
}

export interface BaseParams {
    // chain id to sign message
    chainId: ChainId;
    // network to sign message
    network: Network;
}

export enum Platform {
    Evm = "evm",
    Solana = "solana",
    Sui = "sui",
    Aptos = "aptos",
}

export interface ChainMetadata {
    id: ChainId;
    name: string;
    iconUrl: string;
    iconInvertedUrl?: string;
    explorerUrl: {
        [Network.Mainnet]: string;
        [Network.Testnet]: string;
    }
}