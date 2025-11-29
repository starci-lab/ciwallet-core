import { EvmProvider, SolanaProvider, SuiProvider } from "@ciwallet-sdk/classes"
import { Platform, type BaseParams } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export interface UseTransferParams extends BaseParams {
  // to address in solana, we use ata
  toAddress: string;
  amount: number;
  tokenAddress: string;
  decimals?: number;
  rpcs: Array<string>;
  privateKey: string;
}
export const useTransfer = () => {
    const handle = ({
        chainId,
        network,
        toAddress,
        amount,
        tokenAddress,
        decimals = 18,
        privateKey,
        rpcs,
    }: UseTransferParams) => {
        switch (chainIdToPlatform(chainId)) {
        case Platform.Evm:
            return new EvmProvider({ chainId, network, privateKey, rpcs }).transfer({
                tokenAddress,
                toAddress,
                amount,
                decimals,
            })
        case Platform.Solana:
            return new SolanaProvider({ chainId, network, privateKey, rpcs }).transfer({
                tokenAddress,
                toAddress,
                amount,
                decimals,
                isToken2022: false,
            })
        case Platform.Sui:
            return new SuiProvider({ chainId, network, privateKey, rpcs }).transfer({
                tokenAddress,
                toAddress,
                amount,
                decimals,
            })
        default:
            throw new Error(`Chain ${chainId} is not supported`)
        }
    }
    return {
        handle,
    }
}
