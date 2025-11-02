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
  type BuyPetResponseMessage,
} from "@/nomas/game/colyseus/events"
import type { PurchaseResponse } from "@/nomas/game/systems"

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
      console.log(
        "🔄 [useColyseusReduxSync] Player state sync received:",
        message
      )

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
        console.log(
          "📦 [useColyseusReduxSync] Extracted player data from response:",
          payload
        )
      } else if (message && typeof message === "object" && "data" in message) {
        // Support nested shape under `data` or flat message (player_state_sync format)
        payload = message.data
        console.log(
          "📦 [useColyseusReduxSync] Extracted payload from data:",
          payload
        )
      } else {
        // Flat message format
        payload = message
        console.log(
          "📦 [useColyseusReduxSync] Using flat message format:",
          payload
        )
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
        console.warn(
          "⚠️ [useColyseusReduxSync] No tokens found in message:",
          message
        )
      }

      // Inventory and playerData are handled by other systems via events
      // We just sync tokens here to Redux
      if (payload?.inventory) {
        console.log(
          "📦 [useColyseusReduxSync] Inventory synced (handled by events)"
        )
      }

      if (payload?.playerData) {
        console.log(
          "📊 [useColyseusReduxSync] Player data synced (handled by events)"
        )
      }
    }

    console.log(
      `🎧 [useColyseusReduxSync] Listening to event: ${ColyseusMessageEvents.PlayerStateSync}`
    )
    eventBus.on(ColyseusMessageEvents.PlayerStateSync, handlePlayerSync)

    return () => {
      console.log(
        `🔇 [useColyseusReduxSync] Removing listener: ${ColyseusMessageEvents.PlayerStateSync}`
      )
      eventBus.off(ColyseusMessageEvents.PlayerStateSync, handlePlayerSync)
    }
  }, [dispatch])

  /**
   * Handle pets state synchronization
   * Note: We don't update Redux directly for pets - we emit events for PetManager to handle
   */
  useEffect(() => {
    const handlePetsSync = (message: PetsStateSyncMessage) => {
      console.log("🔄 [useColyseusReduxSync] Pets state sync:", message)
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
      console.log(
        "🔄 [useColyseusReduxSync] Buy pet response received:",
        message
      )

      // Handle nested format: {success: true, data: {currentTokens: ...}}
      let tokens: number | undefined

      if (message && message.data && message.data.currentTokens !== undefined) {
        // Nested format: extract from data
        tokens = message.data.currentTokens
      } else if ((message as any).currentTokens !== undefined) {
        // Flat format: direct access (backward compatibility)
        tokens = (message as any).currentTokens
      }

      if (tokens !== undefined) {
        console.log(
          `💰 [useColyseusReduxSync] Updating tokens from buy_pet_response: ${tokens}`
        )
        dispatch(setNomToken(tokens))
      } else {
        console.warn(
          "⚠️ [useColyseusReduxSync] No tokens found in buy_pet_response:",
          message
        )
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
        console.warn(
          "⚠️ [useColyseusReduxSync] No tokens found in purchase_response:",
          message
        )
      }
    }

    eventBus.on(ColyseusMessageEvents.PurchaseResponse, handlePurchaseResponse)

    return () => {
      eventBus.off(
        ColyseusMessageEvents.PurchaseResponse,
        handlePurchaseResponse
      )
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

    eventBus.on(
      ColyseusMessageEvents.PurchaseItemResponse,
      handlePurchaseItemResponse
    )

    return () => {
      eventBus.off(
        ColyseusMessageEvents.PurchaseItemResponse,
        handlePurchaseItemResponse
      )
    }
  }, [dispatch])
}
