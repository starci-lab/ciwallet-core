import { EvmProvider } from "@/classes"
import { Platform, type BaseParams } from "@/types"
import { chainKeyToPlatform } from "@/utils"
import { useWalletKit } from "@/providers"

export interface UseTransferParams extends BaseParams {
    // to address in solana, we use ata
    toAddress: string;
    amount: number;
}
export const useTransfer = () => {
    const { adapter } = useWalletKit()
    const handle = ({
        chainId,
        network,
        toAddress,
        amount,
    }: UseTransferParams) => {
        switch (chainKeyToPlatform(chainId)) {
        case Platform.Evm:
            return new EvmProvider(
                chainId,
                network,
                adapter,
            ).transfer({
                toAddress,
                amount,
            })
        default:
            throw new Error(`Chain ${chainId} is not supported`)
        }
    }
    
    return {
        handle
    }
}