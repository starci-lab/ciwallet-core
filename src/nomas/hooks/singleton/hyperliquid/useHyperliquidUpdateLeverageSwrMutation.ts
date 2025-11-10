import { selectSelectedAccountByPlatform, useAppDispatch, useAppSelector } from "@/nomas/redux" 
import useSWRMutation from "swr/mutation"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import type { HyperliquidAssetId } from "@ciwallet-sdk/classes"
import { Platform } from "@ciwallet-sdk/types"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"
import { setIsCross } from "@/nomas/redux"

export interface UseHyperliquidUpdateLeverageSwrMutationParams {
    asset: HyperliquidAssetId
    isCross: boolean
    leverage: string | number
}
export const useHyperliquidUpdateLeverageSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const dispatch = useAppDispatch()
    const swrMutation = useSWRMutation(
        ["hyperliquid-update-leverage", network, selectedAccount?.accountAddress],
        async (_, { arg: {
            asset,
            isCross, 
            leverage,
        } }: { arg: UseHyperliquidUpdateLeverageSwrMutationParams }) => {
            dispatch(setIsCross(isCross))
            const result = await exchangeHyperliquidObj.updateLeverage({
                asset,
                leverage,
                isCross,
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