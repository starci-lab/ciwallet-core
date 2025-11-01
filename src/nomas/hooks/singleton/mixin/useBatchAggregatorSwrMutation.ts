import { aggregatorManagerObj } from "@/nomas/obj"
import type { QuoteParams } from "@ciwallet-sdk/classes"
import { useContext } from "react"
import useSWRMutation from "swr/mutation"
import { BatchAggregatorContext } from "./BatchAggregatorProvider"

export const useBatchAggregatorSwrMutationCore = () => {
    const swrMutation = useSWRMutation(
        "BATCH_AGGREGATOR_SWR_MUTATION",
        async (_, { arg }: { arg: QuoteParams }) => {
            const results = await aggregatorManagerObj.batchQuote(arg)
            return results
        }
    )
    return swrMutation
}


export const useBatchAggregatorSwrMutation = () => {
    const context = useContext(BatchAggregatorContext)
    if (!context) {
        throw new Error(
            "useBatchAggregatorSwrMutation must be used within a MixinProvider"
        )
    }
    return context.swrMutation
}
