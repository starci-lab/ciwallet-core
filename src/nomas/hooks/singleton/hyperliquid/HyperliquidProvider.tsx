import React, {
    type PropsWithChildren,
} from "react"
import { useHyperliquidInfoCore } from "./useHyperliquidInfo"
import { useHyperliquidSubscriptionCore } from "./useHyperliquidSubscription"
import { createContext } from "react"
import { 
    useHyperunitGenerateAddressSwrMutationCore, 
    useHyperunitLegalCheckSwrMutationCore, 
    useHyperliquidApproveAgentSwrMutationCore
} from "./apis"

export interface HyperliquidContextType {
    useHyperliquidInfo: ReturnType<typeof useHyperliquidInfoCore> | null
    useHyperliquidSubscription: ReturnType<typeof useHyperliquidSubscriptionCore> | null
    useHyperunitGenerateAddressSwrMutation: ReturnType<typeof useHyperunitGenerateAddressSwrMutationCore> | null
    useHyperunitLegalCheckSwrMutation: ReturnType<typeof useHyperunitLegalCheckSwrMutationCore> | null
    useHyperliquidApproveAgentSwrMutation: ReturnType<typeof useHyperliquidApproveAgentSwrMutationCore> | null
}

export const HyperliquidContext = createContext<HyperliquidContextType>({
    useHyperliquidInfo: null,
    useHyperliquidSubscription: null,
    useHyperunitGenerateAddressSwrMutation: null,
    useHyperunitLegalCheckSwrMutation: null,
    useHyperliquidApproveAgentSwrMutation: null,
})

export const HyperliquidProvider = ({ children }: PropsWithChildren) => {
    const useHyperliquidInfo = useHyperliquidInfoCore()
    const useHyperliquidSubscription = useHyperliquidSubscriptionCore()
    const useHyperunitGenerateAddressSwrMutation = useHyperunitGenerateAddressSwrMutationCore()
    const useHyperunitLegalCheckSwrMutation = useHyperunitLegalCheckSwrMutationCore()
    const useHyperliquidApproveAgentSwrMutation = useHyperliquidApproveAgentSwrMutationCore()
    return (
        <HyperliquidContext.Provider value={{ 
            useHyperliquidInfo, 
            useHyperliquidSubscription, 
            useHyperunitGenerateAddressSwrMutation,
            useHyperunitLegalCheckSwrMutation,
            useHyperliquidApproveAgentSwrMutation,
        }}>
            {children}
        </HyperliquidContext.Provider>
    )
}


