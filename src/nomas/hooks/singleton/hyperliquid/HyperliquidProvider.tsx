import React, {
    type PropsWithChildren,
} from "react"
import { useHyperliquidInfoCore } from "./useHyperliquidInfo"
import { useHyperliquidSubscriptionCore } from "./useHyperliquidSubscription"
import { createContext } from "react"
import { useHyperliquidGenSwrMutationCore } from "./apis"

export interface HyperliquidContextType {
    useHyperliquidInfo: ReturnType<typeof useHyperliquidInfoCore> | null
    useHyperliquidSubscription: ReturnType<typeof useHyperliquidSubscriptionCore> | null
    useHyperliquidGenSwrMutation: ReturnType<typeof useHyperliquidGenSwrMutationCore> | null
}

export const HyperliquidContext = createContext<HyperliquidContextType>({
    useHyperliquidInfo: null,
    useHyperliquidSubscription: null,
    useHyperliquidGenSwrMutation: null,
})

export const HyperliquidProvider = ({ children }: PropsWithChildren) => {
    const useHyperliquidInfo = useHyperliquidInfoCore()
    const useHyperliquidSubscription = useHyperliquidSubscriptionCore()
    const useHyperliquidGenSwrMutation = useHyperliquidGenSwrMutationCore()
    return (
        <HyperliquidContext.Provider value={{ 
            useHyperliquidInfo, 
            useHyperliquidSubscription, 
            useHyperliquidGenSwrMutation 
        }}>
            {children}
        </HyperliquidContext.Provider>
    )
}


