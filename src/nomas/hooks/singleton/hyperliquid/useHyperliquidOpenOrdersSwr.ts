import { selectSelectedAccountByPlatform, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { infoHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWR from "swr"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"
import { setOpenOrders } from "@/nomas/redux"

export const useHyperliquidOpenOrdersSwrCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const dispatch = useAppDispatch()
    return useSWR(
        null
        //["hyperliquid-open-orders", network, selectedAccount?.accountAddress]
        ,
        async () => {
            const openOrders = await infoHyperliquidObj.openOrders({
                clientParams: { network },
                userAddress: selectedAccount?.accountAddress || "",
            })
            dispatch(setOpenOrders(openOrders))
            return openOrders
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