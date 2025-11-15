import { setIsCross, setLeverage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"

export const HyperliquidWorker = () => {
    const activeAssetData = useAppSelector((state) => state.stateless.sections.perp.activeAssetData)
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        // if active asset data is changed, we need to update the updated leverage
        dispatch(setLeverage(activeAssetData?.leverage.value ?? 1))
    }, [activeAssetData?.leverage.value, dispatch])

    useEffect(() => {
        // if is cross is changed, we need to update the active asset data
        dispatch(setIsCross(activeAssetData?.leverage.type === "cross"))
    }, [activeAssetData?.leverage.type, dispatch])
    return null
}