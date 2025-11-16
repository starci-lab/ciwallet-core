import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { setClearingHouseData } from "@/nomas/redux"
import * as hl from "@nktkas/hyperliquid"

export const useSubscribeClearingHouseData = (
    client: hl.SubscriptionClient, 
    userAddress: string,
) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let isCancelled = false
        let sub: hl.Subscription | null = null
        // Async subscribe
        subscriptionHyperliquidObj.subscribeToClearingHouseData({
            client,
            userAddress,
            onUpdate: (event) => dispatch(setClearingHouseData(event)),
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
    }, [client, userAddress, dispatch])
}