import { setHyperunitGenResponse, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperunitObj } from "@/nomas/obj"
import useSWRMutation from "swr/mutation"
import type { HyperunitGenerateAddressParams } from "@ciwallet-sdk/classes"
  
export const useHyperunitGenerateAddressSwrMutationCore = () => {
    const dispatch = useAppDispatch()
    const network = useAppSelector((state) => state.persists.session.network)
    const asset = useAppSelector((state) => state.stateless.sections.perp.depositCurrentAsset)
    const swrMutation = useSWRMutation(
        [
            "hyperunit-generate-address", 
            asset,
            network
        ],
        async (_, 
            { arg: {
                sourceChain,
                destinationChain,
                asset,
                destinationAddress,
            } }: { arg: HyperunitGenerateAddressParams }) => {
            const result = await hyperunitObj.generateAddress({
                network,
                sourceChain,
                destinationChain,
                asset,
                destinationAddress,
            })
            dispatch(setHyperunitGenResponse({
                asset,
                response: {
                    address: result.address,
                    signatures: {
                        fieldNode: result.signatures?.field_node || "",
                        hlNode: result.signatures?.hl_node || "",
                        unitNode: result.signatures?.unit_node || "",
                        unitNodeSignature: result.signatures?.unit_node_signature || "",
                    },
                }
            }))
            return result
        }
    )
    return swrMutation
}   
export const useHyperunitGenerateAddressSwrMutation = () => {
    const swrMutation = useHyperunitGenerateAddressSwrMutationCore()
    return swrMutation
}