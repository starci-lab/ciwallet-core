import { useAppSelector } from "@/nomas/redux"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import useSWRMutation from "swr/mutation"
import { selectSelectedAccountByPlatform } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
  
export const useHyperliquidApproveAgentSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const swrMutation = useSWRMutation(
        ["hyperliquid-approve-agent", network],
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
export const useHyperliquidApproveAgentSwrMutation = () => {
    const swrMutation = useHyperliquidApproveAgentSwrMutationCore()
    return swrMutation
}