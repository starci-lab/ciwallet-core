import { useCallback, useEffect, useRef } from "react"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"

/**
 * Hook specifically for closing shop modal
 * Each event has its own file for better organization
 * Handles both emitting and listening to shop close events with cleanup
 */
export const useCloseShop = () => {
    const handlerRef = useRef<(() => void) | undefined>(undefined)

    /**
   * Emit event to close shop modal
   */
    const closeShop = useCallback(() => {
        eventBus.emit(ShopEvents.CloseShop)
    }, [])

    /**
   * Setup event listener and cleanup
   */
    useEffect(() => {
    // Setup listener for ShopEvents.CloseShop if needed
    // Example: can listen to shop state changes, analytics, etc.
    // const handleCloseShop = () => {
    //     // Handle shop closed event
    //     // Can add logic here: analytics, state updates, etc.
    // }

        // Register listener if needed
        // eventBus.on(ShopEvents.CloseShop, handleCloseShop)
        // handlerRef.current = handleCloseShop

        return () => {
            if (handlerRef.current) {
                eventBus.off(ShopEvents.CloseShop, handlerRef.current)
                handlerRef.current = undefined
            }
        }
    }, [])

    return {
        closeShop,
    }
}
