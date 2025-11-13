import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { infoHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWR from "swr"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"

export const useHyperliquidOpenOrdersSwrCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    return useSWR(
        ["hyperliquid-open-orders", network, selectedAccount?.accountAddress],
        async () => {
            return await infoHyperliquidObj.getOrders({
                clientParams: { network },
                userAddress: selectedAccount?.accountAddress || "",
            })
        }
    )
}
export const useHyperliquidOpenOrdersSwr = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidOpenOrdersSwr
}