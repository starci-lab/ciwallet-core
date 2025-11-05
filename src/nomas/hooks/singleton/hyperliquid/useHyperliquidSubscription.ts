import * as hl from "@nktkas/hyperliquid"
import { useCallback, useContext, useLayoutEffect, useRef } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useDispatch } from "react-redux"
import { setAllMids, setLastCandleSnapshot, useAppSelector } from "@/nomas/redux"

const subscriptionClient = new hl.SubscriptionClient({
    transport: new hl.WebSocketTransport(),
})
export const useHyperliquidSubscriptionCore = () => {
    const subRef = useRef<hl.Subscription | null>(null)
    const dispatch = useDispatch()
    const selectedMarketId = useAppSelector((state) => state.stateless.sections.perp.selectedMarketId)
    const candleInterval = useAppSelector((state) => state.stateless.sections.perp.candleInterval)
    
    const subscribe = useCallback(async () => {
        subRef.current = await subscriptionClient.allMids((event) => {
            dispatch(setAllMids(event))
        })
        subRef.current = await subscriptionClient.candle({
            coin: selectedMarketId,
            interval: candleInterval,
        }, (event) => {
            dispatch(setLastCandleSnapshot(event))
        })
    }, [dispatch])

    const unsubscribe = useCallback(async () => {
        await subRef.current?.unsubscribe()
    }, [])

    useLayoutEffect(() => {
        subscribe()
    }, [subscribe])

    return {
        subscribe,
        unsubscribe,
    }
}

export const useHyperliquidSubscription = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidSubscription
}   