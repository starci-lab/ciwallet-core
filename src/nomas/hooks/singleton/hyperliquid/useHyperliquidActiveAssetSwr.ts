import { selectSelectedAccountByPlatform, setActiveAssetData, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { infoHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"
import useSWR from "swr"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useContext } from "react"

export const useHyperliquidActiveAssetSwrCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const assetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const dispatch = useAppDispatch()
    // we use swr to get the active asset data
    // every time the assetId changes, we fetch the active asset data
    return useSWR(
        ["hyperliquid-active-asset", network, selectedAccount?.accountAddress, assetId],
        async () => {
            const activeAssetData = await infoHyperliquidObj.getActiveAssetData({
                clientParams: { network },
                assetId,
                userAddress: selectedAccount?.accountAddress || "",
            })
            dispatch(setActiveAssetData(activeAssetData))
        }
    )
}
export const useHyperliquidActiveAssetSwr = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidActiveAssetSwr
}