import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux" 
import useSWRMutation from "swr/mutation"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"

export interface UseHyperliquidApproveAgentSwrMutationParams {
    agentAddress: string
}
export const useHyperliquidApproveAgentSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const swrMutation = useSWRMutation(
        ["hyperliquid-approve-agent", network, selectedAccount?.accountAddress],
        async () => {
            const result = await exchangeHyperliquidObj.approveAgent({
                agentAddress: selectedAccount?.accountAddress || "",
                clientParams: {
                    network,
                    privateKey: selectedAccount?.privateKey || "",
                },
            })
            return result
        }
    )
    return swrMutation
}

export const useHyperliquidUpdateLeverageSwrMutation = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidUpdateLeverageSwrMutation
}