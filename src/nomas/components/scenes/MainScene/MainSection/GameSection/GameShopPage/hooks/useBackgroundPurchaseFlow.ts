import { useEffect, useRef, useState } from "react"
import { eventBus } from "@/nomas/game/event-bus"
import { ColyseusActionEvents, ColyseusMessageEvents } from "@/nomas/game/colyseus/events"
import type { BackgroundItem } from "@/nomas/game/configs/gameConfig"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import { setOwnedItems } from "@/nomas/redux/slices/stateless/user"
import { getBackgroundKey } from "../utils/shopKeys"
import { getPurchaseItemIds } from "./useShopOwnership"

/**
 * Hook to manage background purchase flow:
 * - Track pending purchase
 * - Listen to purchase responses
 * - Auto-apply background after successful purchase
 * - Maintain optimistic ownership keys
 */
export const useBackgroundPurchaseFlow = (onChangeBackground: (item: BackgroundItem) => void) => {
    const dispatch = useAppDispatch()
    const ownedItems = useAppSelector((state) => state.stateless.user.ownedItems)

    // Background purchase: keep a pending item so we can auto-apply it right after server confirms purchase
    const pendingBackgroundPurchaseRef = useRef<BackgroundItem | null>(null)
    const [pendingBackgroundPurchaseId, setPendingBackgroundPurchaseId] = useState<string | null>(null)

    // Optimistic owned keys for backgrounds (ids/names lowercased) so shop UI updates instantly
    const [optimisticOwnedBackgroundKeys, setOptimisticOwnedBackgroundKeys] = useState<Set<string>>(new Set())

    // When a background purchase succeeds, refresh inventory + apply the background immediately (UX: no reload needed)
    useEffect(() => {
        const onPurchaseResponse = (message: unknown) => {
            const pending = pendingBackgroundPurchaseRef.current
            if (!pending) return

            const msg = message as { success?: boolean }
            if (msg?.success === false) {
                pendingBackgroundPurchaseRef.current = null
                setPendingBackgroundPurchaseId(null)
                return
            }

            // Optimistically mark as owned so UI updates immediately (server sync will overwrite with canonical state)
            const pendingId = getBackgroundKey(pending)
            const alreadyOwned = ownedItems.some(
                (it) =>
                    String(it.itemId).toLowerCase() === pendingId.toLowerCase() &&
                    ["background", "backgrounds"].includes(String(it.itemType).toLowerCase())
            )
            if (!alreadyOwned) {
                dispatch(
                    setOwnedItems([
                        ...ownedItems,
                        {
                            itemId: pendingId,
                            itemType: "background",
                            quantity: 1,
                            itemName: pending.name
                        }
                    ])
                )
            }

            // Apply purchased background immediately
            // Also store optimistic ownership locally (in case server pushes stale inventory right after purchase)
            setOptimisticOwnedBackgroundKeys((prev) => {
                const next = new Set(prev)
                getPurchaseItemIds(pending).forEach((k) => next.add(String(k).toLowerCase()))
                return next
            })

            onChangeBackground(pending)

            // Refresh state with delay to avoid racing against server inventory update
            setTimeout(() => {
                eventBus.emit(ColyseusActionEvents.RequestPlayerState, {})
                eventBus.emit(ColyseusActionEvents.GetInventory, {})
            }, 800)
            setTimeout(() => {
                eventBus.emit(ColyseusActionEvents.RequestPlayerState, {})
                eventBus.emit(ColyseusActionEvents.GetInventory, {})
            }, 1800)

            pendingBackgroundPurchaseRef.current = null
            setPendingBackgroundPurchaseId(null)
        }

        eventBus.on(ColyseusMessageEvents.PurchaseResponse, onPurchaseResponse)
        eventBus.on(ColyseusMessageEvents.PurchaseItemResponse, onPurchaseResponse)

        return () => {
            eventBus.off(ColyseusMessageEvents.PurchaseResponse, onPurchaseResponse)
            eventBus.off(ColyseusMessageEvents.PurchaseItemResponse, onPurchaseResponse)
        }
    }, [dispatch, onChangeBackground, ownedItems])

    const setPendingBackground = (item: BackgroundItem) => {
        setPendingBackgroundPurchaseId(getBackgroundKey(item))
        pendingBackgroundPurchaseRef.current = item
    }

    return {
        pendingBackgroundPurchaseId,
        optimisticOwnedBackgroundKeys,
        setPendingBackground,
        getBackgroundKey
    }
}
