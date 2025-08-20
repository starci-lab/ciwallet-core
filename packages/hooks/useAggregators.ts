import { CiAggregator } from "@ciwallet-sdk/classes"
import { useWalletKit } from "@ciwallet-sdk/providers"

export const useAggregators = () => {
    const { adapter } = useWalletKit()
    return {
        ciAggregator: new CiAggregator({
            url: adapter.aggregators?.ciAggregator.url
        })
    }
}