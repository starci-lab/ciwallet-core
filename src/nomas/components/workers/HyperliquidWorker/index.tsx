import { setIsCross, setLeverage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"

export const HyperliquidWorker = () => {
    const activeAssetData = useAppSelector((state) => state.stateless.sections.perp.activeAssetData)
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const dispatch = useAppDispatch()
    useEffect(() => {
        // if active asset data is changed, we need to update the updated leverage
        if (activeAssetData?.leverage.value !== leverage) {
            dispatch(setLeverage(activeAssetData?.leverage.value ?? 1))
        }
    }, [activeAssetData, leverage, dispatch])

    useEffect(() => {
        // if is cross is changed, we need to update the active asset data
        if ((activeAssetData?.leverage.type === "cross") !== isCross) {
            dispatch(setIsCross(activeAssetData?.leverage.type === "cross"))
        }
    }, [activeAssetData, isCross, dispatch])
    return null
}