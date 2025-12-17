/**
 * React Hook for Colyseus Redux State Synchronization
 *
 * This file acts as a registry/orchestrator that:
 * - Imports all message handlers from separate files
 * - Registers them with the event bus
 * - Handles cleanup on unmount
 *
 * Each game logic has its own handler file in ./handlers/
 * This keeps the code organized and scalable.
 */

import { useEffect } from "react"
import { useAppDispatch } from "@/nomas/redux"
import { eventBus } from "@/nomas/game/event-bus"
import {
    playerStateHandler,
    petsStateHandler,
    buyPetHandler,
    purchaseHandler,
    purchaseItemHandler,
    cleanedPetHandler
} from "./handlers"

/**
 * Registry of all message handlers
 * Add new handlers here by importing from handlers/
 */
const allHandlers = [
    playerStateHandler,
    petsStateHandler,
    buyPetHandler,
    purchaseHandler,
    purchaseItemHandler,
    cleanedPetHandler
]

/**
 * React hook for syncing Colyseus messages to Redux store
 *
 * This hook registers all message handlers from the handlers/ directory.
 * Each handler is responsible for its own game logic.
 *
 * @example
 * ```tsx
 * useColyseusReduxSync()
 * ```
 */
export const useColyseusReduxSync = (): void => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const cleanupFunctions: Array<() => void> = []

        // Register all handlers from the registry
        allHandlers.forEach(({ event, handler }) => {
            const eventHandler = (message: unknown) => {
                try {
                    // Type assertion: each handler knows its own message type
                    handler(message as never, dispatch)
                } catch (error) {
                    console.error(`[Error handling ${event}:`, error)
                }
            }

            eventBus.on(event, eventHandler)
            cleanupFunctions.push(() => eventBus.off(event, eventHandler))
        })

        // Cleanup all handlers on unmount
        return () => {
            cleanupFunctions.forEach((cleanup) => cleanup())
        }
    }, [dispatch])
}
