import { setHyperunitGenResponse, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperunitObj } from "@/nomas/obj"
import useSWRMutation from "swr/mutation"
import type { HyperliquidChainId, HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
  
export interface HyperunitGenParams {
    sourceChain: HyperliquidChainId
    destinationChain: HyperliquidChainId
    asset: HyperliquidDepositAsset
    destinationAddress: string
}

export interface HyperunitGenResponse {
    address: string
    signatures: {
        field_node: string
        hl_node: string
        unit_node: string
        unit_node_signature: string
    },
    status: string
}

export const useHyperliquidGenSwrMutationCore = () => {
    const dispatch = useAppDispatch()
    const network = useAppSelector((state) => state.persists.session.network)
    const swrMutation = useSWRMutation(
        ["hyperunit-gen", network],
        async (_, { arg: {
            sourceChain,
            destinationChain,
            asset,
            destinationAddress,
        } }: { arg: HyperunitGenParams }) => {
            const result = await hyperunitObj.generateAddress({
                network,
                sourceChain,
                destinationChain,
                asset,
                destinationAddress,
            })
            dispatch(setHyperunitGenResponse({
                asset,
                response: result
            }))
            return result
        }
    )
    return swrMutation
}   
export const useHyperliquidGenSwrMutation = () => {
    const swrMutation = useHyperliquidGenSwrMutationCore()
    return swrMutation
}