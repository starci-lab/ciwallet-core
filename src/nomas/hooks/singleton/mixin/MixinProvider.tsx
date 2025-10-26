import React, {
    type PropsWithChildren,
} from "react"
import { BatchAggregatorProvider } from "./BatchAggregatorProvider"

export const MixinProvider = ({ children }: PropsWithChildren) => {
    return (
        <BatchAggregatorProvider>
            {children}
        </BatchAggregatorProvider>
    )
}


