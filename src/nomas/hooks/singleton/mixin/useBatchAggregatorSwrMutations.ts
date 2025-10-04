import type { QuoteParams } from "@ciwallet-sdk/classes"
import useSWRMutation from "swr/mutation"
import { aggregatorManagerObj } from "@/nomas/obj"

export const useBatchAggregatorSwrMutationsCore = () => {
    const aggregatorManager = aggregatorManagerObj

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
