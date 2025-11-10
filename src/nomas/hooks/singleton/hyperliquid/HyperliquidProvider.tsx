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
import { useHyperliquidActiveAssetSwrCore } from "./useHyperliquidActiveAssetSwr"
import { useHyperliquidUpdateLeverageSwrMutationCore } from "./useHyperliquidUpdateLeverageSwrMutation"
import { useHyperliquidClearHouseSwrCore } from "./useHyperliquidClearHouseSwr"

export interface HyperliquidContextType {
    useHyperliquidInfo: ReturnType<typeof useHyperliquidInfoCore> | null
    useHyperliquidSubscription: ReturnType<typeof useHyperliquidSubscriptionCore> | null
    useHyperunitGenerateAddressSwrMutation: ReturnType<typeof useHyperunitGenerateAddressSwrMutationCore> | null
    useHyperunitLegalCheckSwrMutation: ReturnType<typeof useHyperunitLegalCheckSwrMutationCore> | null
    useHyperliquidApproveAgentSwrMutation: ReturnType<typeof useHyperliquidApproveAgentSwrMutationCore> | null
    useHyperliquidActiveAssetSwr: ReturnType<typeof useHyperliquidActiveAssetSwrCore> | null
    useHyperliquidUpdateLeverageSwrMutation: ReturnType<typeof useHyperliquidUpdateLeverageSwrMutationCore> | null
    useHyperliquidClearHouseSwr: ReturnType<typeof useHyperliquidClearHouseSwrCore> | null
}

export const HyperliquidContext = createContext<HyperliquidContextType>({
    useHyperliquidInfo: null,
    useHyperliquidSubscription: null,
    useHyperunitGenerateAddressSwrMutation: null,
    useHyperunitLegalCheckSwrMutation: null,
    useHyperliquidApproveAgentSwrMutation: null,
    useHyperliquidActiveAssetSwr: null,
    useHyperliquidUpdateLeverageSwrMutation: null,
    useHyperliquidClearHouseSwr: null,
})

export const HyperliquidProvider = ({ children }: PropsWithChildren) => {
    const useHyperliquidInfo = useHyperliquidInfoCore()
    const useHyperliquidSubscription = useHyperliquidSubscriptionCore()
    const useHyperunitGenerateAddressSwrMutation = useHyperunitGenerateAddressSwrMutationCore()
    const useHyperunitLegalCheckSwrMutation = useHyperunitLegalCheckSwrMutationCore()
    const useHyperliquidApproveAgentSwrMutation = useHyperliquidApproveAgentSwrMutationCore()
    const useHyperliquidActiveAssetSwr = useHyperliquidActiveAssetSwrCore()
    const useHyperliquidUpdateLeverageSwrMutation = useHyperliquidUpdateLeverageSwrMutationCore()
    const useHyperliquidClearHouseSwr = useHyperliquidClearHouseSwrCore()
    return (
        <HyperliquidContext.Provider value={{ 
            useHyperliquidInfo, 
            useHyperliquidSubscription, 
            useHyperunitGenerateAddressSwrMutation,
            useHyperunitLegalCheckSwrMutation,
            useHyperliquidApproveAgentSwrMutation,
            useHyperliquidActiveAssetSwr,
            useHyperliquidUpdateLeverageSwrMutation,
            useHyperliquidClearHouseSwr,
        }}>
            {children}
        </HyperliquidContext.Provider>
    )
}


