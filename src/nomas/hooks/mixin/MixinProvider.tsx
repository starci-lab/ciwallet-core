import React, {
    type PropsWithChildren,
} from "react"
import { useBatchAggregatorSwrMutationsCore } from "./useBatchAggregatorSwrMutations"
import { BatchAggregatorContext } from "./core"

export const MixinProvider = ({ children }: PropsWithChildren) => {
    const { swrMutation } = useBatchAggregatorSwrMutationsCore()

    return (
        <BatchAggregatorContext.Provider value={{ swrMutation }}>
            {children}
        </BatchAggregatorContext.Provider>
    )
}


