import { ChainId, Network, Platform } from "@ciwallet-sdk/types"

export const chainIdToPlatform = (chainId: ChainId): Platform => {
    switch (chainId) {
    case ChainId.Monad:
        return Platform.Evm
    case ChainId.Solana:
        return Platform.Solana
    case ChainId.Sui:
        return Platform.Sui
    case ChainId.Aptos:
        return Platform.Aptos
    case ChainId.Bsc:
        return Platform.Evm
    case ChainId.Polygon:
        return Platform.Evm
    case ChainId.Ethereum:
        return Platform.Evm
    case ChainId.Avalanche:
        return Platform.Evm
    case ChainId.Fantom:
        return Platform.Evm
    case ChainId.Arbitrum:
        return Platform.Evm
    case ChainId.Base:
        return Platform.Evm
    case ChainId.Hyperliquid:
        return Platform.Evm
    case ChainId.Plasma:
        return Platform.Evm
    case ChainId.Bitcoin:
        return Platform.Bitcoin
    default:
        throw new Error(`Invalid chain id: ${chainId}`)
    }
}

export const platformToChainIds = (platform: Platform): Array<ChainId> => {
    switch (platform) {
    case Platform.Evm:
        return [ChainId.Monad, ChainId.Bsc, ChainId.Polygon, ChainId.Ethereum, ChainId.Avalanche, ChainId.Fantom, ChainId.Arbitrum, ChainId.Base, ChainId.Hyperliquid, ChainId.Bitcoin]
    case Platform.Solana:
        return [ChainId.Solana]
    case Platform.Sui:
        return [ChainId.Sui]
    case Platform.Aptos:
        return [ChainId.Aptos]
    case Platform.Bitcoin:
        return [ChainId.Bitcoin]
    }
}

const emvChainIdMap: Partial<Record<ChainId, Record<Network, number>>> = {
    [ChainId.Monad]: {
        [Network.Mainnet]: 10143,
        [Network.Testnet]: 10143,
    },
}
export const getEvmChainId = (chainId: ChainId, network: Network): number => {
    const evmChainId = emvChainIdMap[chainId]?.[network]
    if (!evmChainId) {
        throw new Error(`Invalid chain id: ${chainId}`)
    }
    return evmChainId
}
