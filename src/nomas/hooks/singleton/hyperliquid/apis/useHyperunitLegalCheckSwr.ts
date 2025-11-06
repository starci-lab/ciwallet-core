import { useAppSelector } from "@/nomas/redux"
import { hyperunitObj } from "@/nomas/obj"
import useSWRMutation from "swr/mutation"
import type { HyperunitUserInfoLegalCheckParams } from "@ciwallet-sdk/classes"
export const useHyperunitLegalCheckSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const swrMutation = useSWRMutation(
        ["hyperunit-user-info-legal-check", network],
        async (_, { arg: {
            accountAddress,
        } }: { arg: HyperunitUserInfoLegalCheckParams }) => {
            const result = await hyperunitObj.userInfoLegalCheck({
                network,
                accountAddress,
            })
            return result
        }
    )
    return swrMutation
}   
export const useHyperunitLegalCheckSwrMutation = () => {
    const swrMutation = useHyperunitLegalCheckSwrMutationCore()
    return swrMutation
}