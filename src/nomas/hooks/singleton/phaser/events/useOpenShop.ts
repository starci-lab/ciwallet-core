import { useCallback, useEffect, useRef } from "react"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"

/**
 * Hook specifically for opening shop modal
 * Each event has its own file for better organization
 * Handles both emitting and listening to shop open events with cleanup
 */
export const useOpenShop = () => {
    const handlerRef = useRef<(() => void) | undefined>(undefined)

    /**
   * Emit event to open shop modal
   */
    const openShop = useCallback(() => {
        eventBus.emit(ShopEvents.OpenShop)
    }, [])

    /**
   * Setup event listener and cleanup
   */
    useEffect(() => {
    // Setup listener for ShopEvents.OpenShop if needed
    // Example: can listen to shop state changes, analytics, etc.
    // const handleOpenShop = () => {
    //     // Handle shop opened event
    //     // Can add logic here: analytics, state updates, etc.
    // }

        // Register listener if needed
        // eventBus.on(ShopEvents.OpenShop, handleOpenShop)
        // handlerRef.current = handleOpenShop

        return () => {
            // Cleanup: remove listener if it was registered
            if (handlerRef.current) {
                eventBus.off(ShopEvents.OpenShop, handlerRef.current)
                handlerRef.current = undefined
            }
        }
    }, [])

    return {
        openShop,
    }
}
