import { infoHyperliquidObj } from "@/nomas/obj"
import useSWR from "swr"
import { setPerpMetas, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { useContext } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"

export const useHyperliquidAllPerpMetasSwrCore = () => {
    const dispatch = useAppDispatch()
    const network = useAppSelector((state) => state.persists.session.network)
    return useSWR(
        ["hyperliquid-all-perp-metas"],
        async () => {
            const allPerpMetas = await infoHyperliquidObj.allPerpMetas({
                clientParams: { network },
            })
            dispatch(setPerpMetas(allPerpMetas))
        }
    )
}           

export const useHyperliquidAllPerpMetasSwr = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("HyperliquidContext not found")
    }
    return context.useHyperliquidAllPerpMetasSwr
}