import React, {
    type PropsWithChildren,
} from "react"
import { useHyperliquidSubscriptionCore } from "./subscriptions/useHyperliquidSubscription"
import { createContext } from "react"
import { 
    useHyperunitGenerateAddressSwrMutationCore, 
    useHyperunitLegalCheckSwrMutationCore, 
    useHyperliquidApproveAgentSwrMutationCore
} from "./apis"
import { useHyperliquidActiveAssetSwrCore } from "./useHyperliquidActiveAssetSwr"
import { useHyperliquidUpdateLeverageSwrMutationCore } from "./useHyperliquidUpdateLeverageSwrMutation"
import { useHyperliquidClearHouseSwrCore } from "./useHyperliquidClearHouseSwr"
import { useHyperliquidOpenOrdersSwrCore } from "./useHyperliquidOpenOrdersSwr"
import { useHyperliquidUserFeesSwrCore } from "./useHyperliquidUserFeesSwr"
import { useHyperliquidCandleSnapshotSwrCore } from "./useHyperliquidCandleSnapshotSwr"
import { useHyperliquidAllPerpMetasSwrCore } from "./useHyperliquidAllPerpMetasSwr"
import { useHyperliquidClosePositionSwrMutationCore } from "./useHyperliquidClosePositionSwrMutation"
import { useHyperliquidPlaceOrderSwrMutatationCore } from "./useHyperliquidPlaceOrderSwrMutatation"

export interface HyperliquidContextType {
    useHyperliquidCandleSnapshotSwr: ReturnType<typeof useHyperliquidCandleSnapshotSwrCore> | null
    useHyperliquidSubscription: ReturnType<typeof useHyperliquidSubscriptionCore> | null
    useHyperunitGenerateAddressSwrMutation: ReturnType<typeof useHyperunitGenerateAddressSwrMutationCore> | null
    useHyperunitLegalCheckSwrMutation: ReturnType<typeof useHyperunitLegalCheckSwrMutationCore> | null
    useHyperliquidApproveAgentSwrMutation: ReturnType<typeof useHyperliquidApproveAgentSwrMutationCore> | null
    useHyperliquidActiveAssetSwr: ReturnType<typeof useHyperliquidActiveAssetSwrCore> | null
    useHyperliquidUpdateLeverageSwrMutation: ReturnType<typeof useHyperliquidUpdateLeverageSwrMutationCore> | null
    useHyperliquidClearHouseSwr: ReturnType<typeof useHyperliquidClearHouseSwrCore> | null
    useHyperliquidOpenOrdersSwr: ReturnType<typeof useHyperliquidOpenOrdersSwrCore> | null
    useHyperliquidUserFeesSwr: ReturnType<typeof useHyperliquidUserFeesSwrCore> | null
    useHyperliquidAllPerpMetasSwr: ReturnType<typeof useHyperliquidAllPerpMetasSwrCore> | null
    useHyperliquidClosePositionSwrMutation: ReturnType<typeof useHyperliquidClosePositionSwrMutationCore> | null
    useHyperliquidPlaceOrderSwrMutatation: ReturnType<typeof useHyperliquidPlaceOrderSwrMutatationCore> | null
}

export const HyperliquidContext = createContext<HyperliquidContextType>({
    useHyperliquidCandleSnapshotSwr: null,
    useHyperliquidSubscription: null,
    useHyperunitGenerateAddressSwrMutation: null,
    useHyperunitLegalCheckSwrMutation: null,
    useHyperliquidApproveAgentSwrMutation: null,
    useHyperliquidActiveAssetSwr: null,
    useHyperliquidUpdateLeverageSwrMutation: null,
    useHyperliquidClearHouseSwr: null,
    useHyperliquidOpenOrdersSwr: null,
    useHyperliquidUserFeesSwr: null,
    useHyperliquidAllPerpMetasSwr: null,
    useHyperliquidClosePositionSwrMutation: null,
    useHyperliquidPlaceOrderSwrMutatation: null,
})

export const HyperliquidProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const useHyperliquidCandleSnapshotSwr = useHyperliquidCandleSnapshotSwrCore()
    const useHyperliquidSubscription = useHyperliquidSubscriptionCore()
    const useHyperunitGenerateAddressSwrMutation = useHyperunitGenerateAddressSwrMutationCore()
    const useHyperunitLegalCheckSwrMutation = useHyperunitLegalCheckSwrMutationCore()
    const useHyperliquidApproveAgentSwrMutation = useHyperliquidApproveAgentSwrMutationCore()
    const useHyperliquidActiveAssetSwr = useHyperliquidActiveAssetSwrCore()
    const useHyperliquidUpdateLeverageSwrMutation = useHyperliquidUpdateLeverageSwrMutationCore()
    const useHyperliquidClearHouseSwr = useHyperliquidClearHouseSwrCore()
    const useHyperliquidOpenOrdersSwr = useHyperliquidOpenOrdersSwrCore()
    const useHyperliquidUserFeesSwr = useHyperliquidUserFeesSwrCore()
    const useHyperliquidAllPerpMetasSwr = useHyperliquidAllPerpMetasSwrCore()
    const useHyperliquidClosePositionSwrMutation = useHyperliquidClosePositionSwrMutationCore()
    const useHyperliquidPlaceOrderSwrMutatation = useHyperliquidPlaceOrderSwrMutatationCore()
    return (
        <HyperliquidContext.Provider value={{ 
            useHyperliquidCandleSnapshotSwr, 
            useHyperliquidSubscription, 
            useHyperunitGenerateAddressSwrMutation,
            useHyperunitLegalCheckSwrMutation,
            useHyperliquidApproveAgentSwrMutation,
            useHyperliquidActiveAssetSwr,
            useHyperliquidUpdateLeverageSwrMutation,
            useHyperliquidClearHouseSwr,
            useHyperliquidOpenOrdersSwr,
            useHyperliquidUserFeesSwr,
            useHyperliquidAllPerpMetasSwr,
            useHyperliquidClosePositionSwrMutation,
            useHyperliquidPlaceOrderSwrMutatation,
        }}>
            {children}
        </HyperliquidContext.Provider>
    )
}


