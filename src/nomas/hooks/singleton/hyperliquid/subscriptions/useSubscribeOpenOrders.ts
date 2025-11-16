import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import * as hl from "@nktkas/hyperliquid"
import { setOpenOrders } from "@/nomas/redux"

export const useSubscribeOpenOrdersCore = (
    client: hl.SubscriptionClient, 
    userAddress: string
) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToOpenOrders({
            client,
            userAddress,
            onUpdate: (event) => dispatch(setOpenOrders(event)),
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
    }, [client, userAddress])
}

export const useSubscribeOpenOrders = (
    client: hl.SubscriptionClient, 
    userAddress: string
) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToOpenOrders({
            client,
            userAddress,
            onUpdate: (event) => dispatch(setOpenOrders(event)),
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
    }, [client, userAddress])
}