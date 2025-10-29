import { AptosProvider, EvmProvider, SolanaProvider, SuiProvider } from "@ciwallet-sdk/classes"
import { Platform, type BaseParams } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export interface UseBalanceParams extends BaseParams {
  // to address in solana, we use ata
  address: string;
  tokenAddress?: string;
  decimals?: number;
  rpcs: Array<string>;
  isToken2022?: boolean;
}
export const useBalance = () => {
    const handle = ({
        chainId,
        network,
        address,
        tokenAddress,
        decimals = 18,
        rpcs,
        isToken2022 = false,
    }: UseBalanceParams) => {
        switch (chainIdToPlatform(chainId)) {
        case Platform.Evm: {
            return new EvmProvider({ chainId, network, rpcs }).fetchBalance({
                accountAddress: address,
                tokenAddress,
                decimals,
            })
        }
        case Platform.Solana: {
            return new SolanaProvider({ chainId, network, rpcs }).fetchBalance({
                accountAddress: address,
                tokenAddress,
                decimals,
                isToken2022,
            })
        }
        case Platform.Sui: {
            return new SuiProvider({ chainId, network, rpcs }).fetchBalance({
                accountAddress: address,
                tokenAddress,
                decimals,
                isToken2022,
            })
        }
        case Platform.Aptos: {
            return new AptosProvider({ chainId, network, rpcs }).fetchBalance({
                accountAddress: address,
                tokenAddress,
                decimals,
            })
        }
        default:
            throw new Error(`Chain ${chainId} is not supported`)
        }
    }
    return {
        handle,
    }
}
