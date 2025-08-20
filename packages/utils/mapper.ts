import { ChainId, Network, Platform } from "@ciwallet-sdk/types"

export const chainKeyToPlatform = (chainId: ChainId): Platform => {
    switch (chainId) {
    case ChainId.Monad:
        return Platform.Evm
    case ChainId.Solana:
        return Platform.Solana
    case ChainId.Sui:
        return Platform.Sui
    case ChainId.Aptos:
        return Platform.Aptos
    default:
        throw new Error(`Invalid chain id: ${chainId}`)
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
