import { useCallback, useContext, useLayoutEffect, useMemo } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useDispatch } from "react-redux"
import { selectSelectedAccountByPlatform, setActiveAssetCtx, setAllMids, setClearingHouseData, setLastCandleSnapshot, useAppSelector } from "@/nomas/redux"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { Platform } from "@ciwallet-sdk/types"

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
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
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
            }),
            subscriptionHyperliquidObj.subscribeToClearingHouseData({
                client: client,
                onUpdate: (event) => {
                    dispatch(setClearingHouseData(event))
                },
                userAddress: selectedAccount?.accountAddress || "",
            }),
            subscriptionHyperliquidObj.subscribeToActiveAssetCtx({
                client: client,
                onUpdate: (event) => {
                    dispatch(setActiveAssetCtx(event))
                },
                assetId: selectedAssetId,
            }),
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