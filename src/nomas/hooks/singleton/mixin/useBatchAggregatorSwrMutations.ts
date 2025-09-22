import type { QuoteParams } from "@ciwallet-sdk/classes"
import useSWRMutation from "swr/mutation"
import { useAppSelector } from "@/nomas/redux"

export const useBatchAggregatorSwrMutationsCore = () => {
    const aggregatorManager = useAppSelector(state => state.aggregator.manager)

    const swrMutation = useSWRMutation(
        "BATCH_AGGREGATOR_SWR_MUTATION",
        async (_, { arg }: { arg: QuoteParams }) => {
            return await aggregatorManager.batchQuote(arg)
        }
    )
    return {
        swrMutation
    }
}
