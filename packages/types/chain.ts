export enum ChainId {
    Monad = "monad",
    Solana = "solana",
    Sui = "sui",
    Aptos = "aptos",
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