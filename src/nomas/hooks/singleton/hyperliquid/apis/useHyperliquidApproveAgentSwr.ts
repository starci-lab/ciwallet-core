import { useAppSelector } from "@/nomas/redux"
import { hyperunitObj } from "@/nomas/obj"
import useSWRMutation from "swr/mutation"
import type { ApproveAgentParams } from "@ciwallet-sdk/classes"
  
export const useHyperliquidApproveAgentSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const swrMutation = useSWRMutation(
        ["hyperliquid-approve-agent", network],
        async (_, { arg: {
            accountAddress,
            privateKey,
        } }: { arg: ApproveAgentParams }) => {
            const result = await hyperunitObj.userInfoApproveAgent({
                network,
                accountAddress,
                privateKey,
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