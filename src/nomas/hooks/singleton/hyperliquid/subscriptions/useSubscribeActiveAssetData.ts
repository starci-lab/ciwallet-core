import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { setActiveAssetCtx, setActiveAssetData } from "@/nomas/redux"
import type { HyperliquidAssetId } from "@ciwallet-sdk/classes"
import * as hl from "@nktkas/hyperliquid"

export const useSubscribeActiveAssetData = (
    client: hl.SubscriptionClient,
    assetId: HyperliquidAssetId,
    userAddress: string,
) => {
    const dispatch = useDispatch()

    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToActiveAssetData({
            client,
            assetId,
            userAddress: userAddress,
            onUpdate: (event) => {
                dispatch(setActiveAssetData(event))
            },
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
    }, [client, assetId, dispatch])
}

export const useSubscribeActiveAssetCtx = (
    client: hl.SubscriptionClient,
    assetId: HyperliquidAssetId,
) => {
    const dispatch = useDispatch()

    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToActiveAssetCtx({
            client,
            assetId,
            onUpdate: (event) => dispatch(setActiveAssetCtx(event)),
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
    }, [client, assetId, dispatch])
}