import { selectPerpUniverseById, selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWRMutation from "swr/mutation"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"
import { HyperliquidAssetId, HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import pRetry from "p-retry"
import Decimal from "decimal.js"
import { formatPrice, formatSize } from "@nktkas/hyperliquid/utils"

export interface UseHyperliquidClosePositionSwrMutationParams {
    price: string
    size: string
    assetId: HyperliquidAssetId
}

export const useHyperliquidClosePositionSwrMutationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const assetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const universe = useAppSelector((state) => selectPerpUniverseById(state.stateless.sections))
    // we use swr to get the active asset data
    // every time the assetId changes, we fetch the active asset data
    return useSWRMutation(
        ["hyperliquid-close-position", network, selectedAccount?.accountAddress, assetId],
        async (_, { arg: {
            price,
            size,
            assetId,
        } }: { arg: UseHyperliquidClosePositionSwrMutationParams }) => {
            await pRetry(
                async () => {
                    // we either increase/decrease the price by 10% to ensure the order is executed
                    const priceForEnsureExecution = orderSide === HyperliquidOrderSide.Buy ?
                        new Decimal(price).mul(0.95).toNumber() :
                        new Decimal(price).mul(1.05).toNumber()
                    return await exchangeHyperliquidObj.closePosition({
                        clientParams: { network, privateKey: selectedAccount?.privateKey || "" },
                        asset: assetId,
                        price: formatPrice(priceForEnsureExecution.toString(), universe?.szDecimals ?? 1),
                        size: formatSize(size, universe?.szDecimals ?? 1),
                        side: orderSide,
                    })  
                }, { retries: 10 })
        }
    )
}
export const useHyperliquidClosePositionSwrMutation = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidClosePositionSwrMutation
}