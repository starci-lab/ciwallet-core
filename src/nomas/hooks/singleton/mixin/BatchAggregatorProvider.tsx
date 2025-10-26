import { createContext, type PropsWithChildren } from "react"
import { useBatchAggregatorSwrMutationCore } from "./useBatchAggregatorSwrMutation"

export interface BatchAggregatorContextType {
    swrMutation: ReturnType<typeof useBatchAggregatorSwrMutationCore>
}
  
export const BatchAggregatorContext = createContext<BatchAggregatorContextType | null>(
    null
)

export const BatchAggregatorProvider = ({ children }: PropsWithChildren) => {
    const swrMutation = useBatchAggregatorSwrMutationCore()
    return (
        <BatchAggregatorContext.Provider value={{ swrMutation }}>
            {children}
        </BatchAggregatorContext.Provider>
    )
}