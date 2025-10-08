import { EvmProvider, SolanaProvider, SuiProvider } from "@ciwallet-sdk/classes"
import { useWalletKit } from "@ciwallet-sdk/providers"
import { Platform, type BaseParams } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export interface UseBalanceParams extends BaseParams {
  // to address in solana, we use ata
  address: string
  tokenAddress?: string
  decimals?: number
}
export const useBalance = () => {
  const { adapter } = useWalletKit()
  const handle = ({
    chainId,
    network,
    address,
    tokenAddress,
    decimals = 18,
  }: UseBalanceParams) => {
    switch (chainIdToPlatform(chainId)) {
      case Platform.Evm: {
        return new EvmProvider(chainId, network, adapter, address).fetchBalance(
          {
            accountAddress: address,
            tokenAddress,
            decimals,
          }
        )
      }
      case Platform.Solana: {
        return new SolanaProvider(
          chainId,
          network,
          adapter,
          address
        ).fetchBalance({
          accountAddress: address,
          tokenAddress,
          decimals,
        })
      }
      case Platform.Sui:
        return new SuiProvider(chainId, network, adapter, address).fetchBalance(
          {
            accountAddress: address,
            tokenAddress,
            decimals,
          }
        )
      default:
        throw new Error(`Chain ${chainId} is not supported`)
    }
  }
  return {
    handle,
  }
}
