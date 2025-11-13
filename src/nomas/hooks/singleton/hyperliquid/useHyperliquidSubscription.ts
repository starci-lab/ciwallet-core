import { useCallback, useContext, useLayoutEffect, useMemo } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useDispatch } from "react-redux"
import { setAllMids, setLastCandleSnapshot, useAppSelector } from "@/nomas/redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"

export const useHyperliquidSubscriptionCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const client = useMemo(
        () => 
            subscriptionHyperliquidObj.getSubscriptionClient({
                network: network,
            }), 
        [network]
    )
    const dispatch = useDispatch()
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const candleInterval = useAppSelector((state) => state.stateless.sections.perp.candleInterval)
    const subscribe = useCallback(async () => {
        await Promise.all([
            subscriptionHyperliquidObj.subscribeToAllMids({
                client: client,
                onUpdate: (event) => {
                    dispatch(setAllMids(event))
                }
            }),
            subscriptionHyperliquidObj.subscribeToCandle({
                client: client,
                onUpdate: (event) => {
                    dispatch(setLastCandleSnapshot(event))
                },
                assetId: selectedAssetId,
                interval: candleInterval,
            })
        ])
    }, [dispatch, client, selectedAssetId, candleInterval])

    const unsubscribe = useCallback(async () => {
        await Promise.all([
            subscriptionHyperliquidObj.subscribeToAllMids({
                client: client,
                onUpdate: (event) => {
                    dispatch(setAllMids(event))
                }
            }),
            subscriptionHyperliquidObj.subscribeToCandle({
                client: client,
                onUpdate: (event) => {
                    dispatch(setLastCandleSnapshot(event))
                },
                assetId: selectedAssetId,
                interval: candleInterval,
            })
        ])
    }, [])

    useLayoutEffect(() => {
        subscribe()
        return () => {
            unsubscribe()
        }
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