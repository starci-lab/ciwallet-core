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
    console.log("🏠 Opening home page via useOpenHome hook")
    eventBus.emit(HomeEvents.OpenHome)
  }, [])

  /**
   * Setup event listener and cleanup
   */
  useEffect(() => {
    // Setup listener for HomeEvents.OpenHome if needed
    // Example: can listen to home state changes, analytics, etc.
    // const handleOpenHome = () => {
    //     // Handle home opened event
    //     // Can add logic here: analytics, state updates, etc.
    // }

    // Register listener if needed
    // eventBus.on(HomeEvents.OpenHome, handleOpenHome)
    // handlerRef.current = handleOpenHome

    return () => {
      // Cleanup: remove listener if it was registered
      if (handlerRef.current) {
        eventBus.off(HomeEvents.OpenHome, handlerRef.current)
        handlerRef.current = undefined
      }
    }
  }, [])

  return {
    openHome,
  }
}
