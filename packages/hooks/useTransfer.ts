import { EvmProvider, SolanaProvider } from "@ciwallet-sdk/classes"
import { Platform, type BaseParams } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export interface UseTransferParams extends BaseParams {
  // to address in solana, we use ata
  toAddress: string;
  amount: number;
  tokenAddress: string;
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
        privateKey,
        rpcs,
    }: UseTransferParams) => {
        switch (chainIdToPlatform(chainId)) {
        case Platform.Evm:
            return new EvmProvider({ chainId, network, privateKey, rpcs }).transfer({
                tokenAddress,
                toAddress,
                amount,
            })
        case Platform.Solana:
            return new SolanaProvider(chainId, network, privateKey, rpcs).transfer({
                tokenAddress,
                toAddress,
                amount,
            })
        default:
            throw new Error(`Chain ${chainId} is not supported`)
        }
    }
    return {
        handle,
    }
}
