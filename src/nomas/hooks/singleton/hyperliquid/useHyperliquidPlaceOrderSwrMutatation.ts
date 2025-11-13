import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWRMutation from "swr/mutation"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"

export interface UseHyperliquidPlaceOrderSwrMutatationParams {
    price: string
    size: string
    reduceOnly: boolean
}
export const useHyperliquidPlaceOrderSwrMutatationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const assetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    // we use swr to get the active asset data
    // every time the assetId changes, we fetch the active asset data
    return useSWRMutation(
        ["hyperliquid-place-order", network, selectedAccount?.accountAddress, assetId],
        async (_, { arg: {
            price,
            size,
            reduceOnly,
        } }: { arg: UseHyperliquidPlaceOrderSwrMutatationParams }) => {
            return await exchangeHyperliquidObj.placeOrder({
                clientParams: { network, privateKey: selectedAccount?.privateKey || "" },
                asset: assetId,
                reduceOnly,
                price,
                size,
                side: orderSide,     
            })
        }
    )
}
export const useHyperliquidPlaceOrderSwrMutatation = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidPlaceOrderSwrMutatation
}