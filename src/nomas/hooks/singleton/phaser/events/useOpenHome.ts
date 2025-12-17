import { useCallback, useEffect, useRef } from "react"
import { eventBus } from "@/nomas/game/event-bus"
import { HomeEvents } from "@/nomas/game/events/home/HomeEvents"

/**
 * Hook specifically for opening home page
 * Each event has its own file for better organization
 * Handles both emitting and listening to home open events with cleanup
 */
export const useOpenHome = () => {
    const handlerRef = useRef<(() => void) | undefined>(undefined)

    /**
     * Emit event to open home page
     */
    const openHome = useCallback(() => {
        eventBus.emit(HomeEvents.OpenHome)
    }, [])

    /**
     * Setup event listener and cleanup
     */
    useEffect(() => {
        return () => {
            // Cleanup: remove listener if it was registered
            if (handlerRef.current) {
                eventBus.off(HomeEvents.OpenHome, handlerRef.current)
                handlerRef.current = undefined
            }
        }
    }, [])

    return {
        openHome
    }
}
