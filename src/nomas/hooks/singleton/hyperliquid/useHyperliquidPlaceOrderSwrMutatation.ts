import { selectPerpUniverseById, selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { exchangeHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWRMutation from "swr/mutation"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"
import pRetry from "p-retry"
import Decimal from "decimal.js"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { formatPrice, formatSize } from "@nktkas/hyperliquid/utils"

export interface UseHyperliquidPlaceOrderSwrMutatationParams {
    price: string
    size: string
    reduceOnly: boolean
    takeProfit?: string
    stopLoss?: string
}
export const useHyperliquidPlaceOrderSwrMutatationCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const assetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const universe = useAppSelector((state) => selectPerpUniverseById(state.stateless.sections))
    // we use swr to get the active asset data
    // every time the assetId changes, we fetch the active asset data
    return useSWRMutation(
        ["hyperliquid-place-order", network, selectedAccount?.accountAddress, assetId],
        async (_, { arg: {
            price,
            size,
            reduceOnly,
            takeProfit,
            stopLoss,
        } }: { arg: UseHyperliquidPlaceOrderSwrMutatationParams }) => {
            // we either increase/decrease the price by 10% to ensure the order is executed
            const priceForEnsureExecution = orderSide === HyperliquidOrderSide.Buy ?
                new Decimal(price).mul(1.05).toNumber() :
                new Decimal(price).mul(0.95).toNumber()
            await pRetry(async () => {
                return await exchangeHyperliquidObj.placeOrder({
                    clientParams: { network, privateKey: selectedAccount?.privateKey || "" },
                    asset: assetId,
                    reduceOnly,
                    price: formatPrice(priceForEnsureExecution.toString(), universe?.szDecimals ?? 1),
                    size: formatSize(size, universe?.szDecimals ?? 1),
                    side: orderSide,     
                    takeProfit,
                    stopLoss,
                })
            }, { retries: 10 })
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