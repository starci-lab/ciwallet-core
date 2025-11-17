import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { setLastCandleSnapshot, setLastPositionCandleSnapshot } from "@/nomas/redux"
import type { CandleInterval, HyperliquidAssetId } from "@ciwallet-sdk/classes"
import * as hl from "@nktkas/hyperliquid"

export const useSubscribeCandle = (
    client: hl.SubscriptionClient, 
    assetId: HyperliquidAssetId, 
    interval: CandleInterval
) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToCandle({
            client,
            assetId,
            interval,
            onUpdate: (event) => dispatch(setLastCandleSnapshot(event)),
        }).then((subscription) => {
            // If effect is cancelled, unsubscribe
            if (isCancelled) {
                subscription.unsubscribe()
                return
            }
            sub = subscription
        })
        return () => {
            isCancelled = true
            sub?.unsubscribe()
        }
    }, [client, assetId, interval])
}

export const useSubscribePositionCandle = (
    client: hl.SubscriptionClient, 
    assetId: HyperliquidAssetId, 
    interval: CandleInterval
) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToCandle({
            client,
            assetId,
            interval,
            onUpdate: (event) => dispatch(setLastPositionCandleSnapshot(event)),
        }).then((subscription) => {
            // If effect is cancelled, unsubscribe
            if (isCancelled) {
                subscription.unsubscribe()
                return
            }
            sub = subscription
        })
        return () => {
            isCancelled = true
            sub?.unsubscribe()
        }
    }, [client, assetId, interval])
}