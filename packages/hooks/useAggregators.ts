import { useWalletKit } from "@ciwallet-sdk/providers"

export const useAggregators = () => {
    const { adapter } = useWalletKit()
    return {
        aggregators: adapter.aggregators
    }
}