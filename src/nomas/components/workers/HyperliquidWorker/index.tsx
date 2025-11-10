// import { useAppSelector } from "@/nomas/redux"
// import { useHyperliquidApproveAgentSwrMutation } from "@/nomas/hooks"
// import { useEffect } from "react"
// import Decimal from "decimal.js"
// import { selectSelectedAccountByPlatform } from "@/nomas/redux"
// import { Platform } from "@ciwallet-sdk/types"
import { setIsCross, setLeverage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"

export const HyperliquidWorker = () => {
    // const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    // const swrMutation = useHyperliquidApproveAgentSwrMutation()
    // const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    // useEffect(() => {
    //     if (
    //         new Decimal(clearingHouseData?.marginSummary.accountValue || "0"
    //         ).eq(0)) {  // if account value is 0, we don't need to approve agent
    //         return
    //     }
    //     const handleEffect = async () => {
    //         // establisted connection to agent
    //         await swrMutation.trigger()
    //     }
    //     handleEffect()
    // }, [clearingHouseData, swrMutation, selectedAccount])
    const activeAssetData = useAppSelector((state) => state.stateless.sections.perp.activeAssetData)
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        // if active asset data is changed, we need to update the updated leverage
        if (activeAssetData?.leverage.value !== leverage) {
            dispatch(setLeverage(activeAssetData?.leverage.value ?? 1))
        }
    }, [activeAssetData])

    useEffect(() => {
        // if is cross is changed, we need to update the active asset data
        if ((activeAssetData?.leverage.type === "cross") !== isCross) {
            dispatch(setIsCross(activeAssetData?.leverage.type === "cross"))
        }
    }, [activeAssetData])
    return null
}