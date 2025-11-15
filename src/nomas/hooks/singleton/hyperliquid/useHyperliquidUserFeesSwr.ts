import { setUserFees, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { selectSelectedAccountByPlatform } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import useSWR from "swr"
import { infoHyperliquidObj } from "@/nomas/obj"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"

export const useHyperliquidUserFeesSwrCore = () => {
    const dispatch = useAppDispatch()
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    return useSWR(
        ["hyperliquid-user-fees", network, selectedAccount?.accountAddress],
        async () => {
            const fees = await infoHyperliquidObj.getUserFees({
                clientParams: { network },
                accountAddress: selectedAccount?.accountAddress || "",
            })
            dispatch(setUserFees(fees))
            return fees
        }
    )
}

export const useHyperliquidUserFeesSwr = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("HyperliquidContext not found")
    }
    return context.useHyperliquidUserFeesSwr
}