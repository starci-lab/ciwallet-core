import {  useEffect } from "react"
import { useDispatch } from "react-redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { setAllMids } from "@/nomas/redux"
import * as hl from "@nktkas/hyperliquid"

export const useSubscribeAllMids = (client: hl.SubscriptionClient) => {
    const dispatch = useDispatch()

    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToAllMids({
            client,
            onUpdate: (event) => dispatch(setAllMids(event)),
        }).then((subscription) => {
            // If effect is cancelled, unsubscribe
            if (isCancelled) {
                subscription.unsubscribe()
                return
            }
            sub = subscription as hl.Subscription
        })
        return () => {
            isCancelled = true
            sub?.unsubscribe()
        }
    }, [client, dispatch])
}   