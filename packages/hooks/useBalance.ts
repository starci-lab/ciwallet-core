import { EvmProvider } from "@ciwallet-sdk/classes"
import { Platform, type BaseParams } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { useWalletKit } from "@ciwallet-sdk/providers"

export interface UseBalanceParams extends BaseParams {
    // to address in solana, we use ata
    address: string;
    tokenAddress?: string;
    decimals?: number;
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
        case Platform.Evm:
        {
            return new EvmProvider(
                chainId,
                network,
                adapter,
            ).fetchBalance({
                accountAddress: address,
                tokenAddress,
                decimals,
            })
        }
        case Platform.Solana:
            throw new Error("Solana is not supported")
        default:
            throw new Error(`Chain ${chainId} is not supported`)
        }
    }
    return {
        handle
    }
}