import type { AggregatorId, IAggregator } from "@ciwallet-sdk/classes"
import { createContext, useContext } from "react"
import type { SWRMutationResponse } from "swr/mutation"

export interface BatchAggregatorContextType {
    swrMutation: SWRMutationResponse<
    Record<AggregatorId, Awaited<ReturnType<IAggregator["quote"]>>>, 
    Error, 
    "BATCH_AGGREGATOR_SWR_MUTATION", 
    Parameters<IAggregator["quote"]>[0]>;
}
  
export const BatchAggregatorContext = createContext<BatchAggregatorContextType | null>(
    null
)

export const useBatchAggregatorSwrMutations = () => {
    const context = useContext(BatchAggregatorContext)
    if (!context) {
        throw new Error(
            "useBatchAggregatorSwrMutations must be used within a MixinProvider"
        )
    }
    return context
}