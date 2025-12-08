/* eslint-disable indent */
/**
 * React Hook for Colyseus Redux State Synchronization
 *
 * Listens to Colyseus message events and dispatches Redux actions.
 * This hook handles:
 * - Listening to player_state_sync events
 * - Dispatching setNomToken when tokens change
 * - Handling inventory sync
 * - Handling pet sync (emitting events for PetManager to handle)
 */

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { eventBus } from "@/nomas/game/event-bus"
import { setNomToken } from "@/nomas/redux"
import {
    ColyseusMessageEvents,
    type PlayerStateSyncMessage,
    type PetsStateSyncMessage,
    type BuyPetResponseMessage
} from "@/nomas/game/colyseus/events"
import type { PurchaseCleanedPetResponse, PurchaseResponse } from "@/nomas/game/systems"

/**
 * React hook for syncing Colyseus messages to Redux store
 *
 * @example
 * ```tsx
 * useColyseusReduxSync()
 * ```
 */
export const useColyseusReduxSync = (): void => {
    const dispatch = useDispatch()

    /**
     * Handle player state synchronization
     * Handles both player_state_sync and player-state-response messages
     */
    useEffect(() => {
        const handlePlayerSync = (message: PlayerStateSyncMessage | any) => {
            // Handle player-state-response format: {success: true, data: {player: {tokens: ...}, pets: [...]}}
            let payload: any = message

            // Check if it's the player-state-response format
            if (
                message &&
                typeof message === "object" &&
                "success" in message &&
                "data" in message &&
                message.data?.player
            ) {
                // Extract player data from response format
                payload = message.data.player
            } else if (message && typeof message === "object" && "data" in message) {
                // Support nested shape under `data` or flat message (player_state_sync format)
                payload = message.data
            } else {
                // Flat message format
                payload = message
            }

            // Update tokens if provided
            // Tokens can be in payload.tokens or payload.player?.tokens
            const tokens =
                payload?.tokens !== undefined
                    ? payload.tokens
                    : payload?.player?.tokens !== undefined
                      ? payload.player.tokens
                      : undefined

            if (tokens !== undefined) {
                dispatch(setNomToken(tokens))
            } else {
                console.warn("⚠️ [useColyseusReduxSync] No tokens found in message:", message)
            }
        }

        eventBus.on(ColyseusMessageEvents.PlayerStateSync, handlePlayerSync)

        return () => {
            eventBus.off(ColyseusMessageEvents.PlayerStateSync, handlePlayerSync)
        }
    }, [dispatch])

    /**
     * Handle pets state synchronization
     * Note: We don't update Redux directly for pets - we emit events for PetManager to handle
     */
    useEffect(() => {
        const handlePetsSync = (_message: PetsStateSyncMessage) => {
            // Pets sync is handled by PetManager via event listeners
            // This hook just logs it - the actual sync happens in Phaser layer
        }

        eventBus.on(ColyseusMessageEvents.PetsStateSync, handlePetsSync)

        return () => {
            eventBus.off(ColyseusMessageEvents.PetsStateSync, handlePetsSync)
        }
    }, [])

    /**
     * Handle buy_pet_response to sync tokens
     * Supports both flat and nested message formats
     * Note: Pet sync is handled by PetManager via event listeners
     */
    useEffect(() => {
        const handleBuyPetResponse = (message: BuyPetResponseMessage) => {
            // Handle nested format: {success: true, data: {currentTokens: ...}}
            let tokens: number | undefined

            if (message && message.data.tokens !== undefined) {
                // Nested format: extract from data
                tokens = message.data.tokens
            } else if ((message as any).tokens !== undefined) {
                // Flat format: direct access (backward compatibility)
                tokens = (message as any).tokens
            }

            if (tokens !== undefined) {
                dispatch(setNomToken(tokens))
            } else {
                console.warn("⚠️ No tokens found", message)
            }

            // Note: Pet sync and toast notifications are handled by PetManager
            // which listens to the same BuyPetResponse event
        }

        eventBus.on(ColyseusMessageEvents.BuyPetResponse, handleBuyPetResponse)

        return () => {
            eventBus.off(ColyseusMessageEvents.BuyPetResponse, handleBuyPetResponse)
        }
    }, [dispatch])

    /**
     * Handle purchase responses to sync tokens
     * Supports both flat and nested message formats
     */
    useEffect(() => {
        const handlePurchaseResponse = (message: PurchaseResponse) => {
            if (message.newTokenBalance !== undefined) {
                dispatch(setNomToken(message.newTokenBalance))
            } else {
                console.warn("⚠️ No tokens found", message)
            }
        }

        eventBus.on(ColyseusMessageEvents.PurchaseResponse, handlePurchaseResponse)

        return () => {
            eventBus.off(ColyseusMessageEvents.PurchaseResponse, handlePurchaseResponse)
        }
    }, [dispatch])

    /**
     * Handle purchase_item_response to sync tokens
     * Supports both flat and nested message formats
     */
    useEffect(() => {
        const handlePurchaseItemResponse = (message: PurchaseResponse) => {
            if (message.newTokenBalance !== undefined) {
                dispatch(setNomToken(message.newTokenBalance))
            }
        }

        eventBus.on(ColyseusMessageEvents.PurchaseItemResponse, handlePurchaseItemResponse)

        return () => {
            eventBus.off(ColyseusMessageEvents.PurchaseItemResponse, handlePurchaseItemResponse)
        }
    }, [dispatch])

    /**
     * Handle cleaned_pet_response to sync tokens
     * Supports both flat and nested message formats
     */
    useEffect(() => {
        const handleCleanedPetResponse = (message: PurchaseCleanedPetResponse) => {
            if (message.data.remainingTokens !== undefined) {
                dispatch(setNomToken(message.data.remainingTokens))
            }
        }

        eventBus.on(ColyseusMessageEvents.CleanedPetResponse, handleCleanedPetResponse)

        return () => {
            eventBus.off(ColyseusMessageEvents.CleanedPetResponse, handleCleanedPetResponse)
        }
    }, [dispatch])
}
