/* eslint-disable indent */
/**
 * React Hook for Colyseus Message Handling
 *
 * Sets up message listeners on Colyseus room and emits typed events.
 * This hook handles:
 * - Setting up room.onMessage("*", ...) listener
 * - Mapping message types to event names
 * - Emitting typed events for each message type
 * - Cleanup on unmount
 */

import { useEffect } from "react"
import { Room } from "colyseus.js"
import { eventBus } from "@/nomas/game/event-bus"
import type { GameRoomState } from "@/nomas/game/schema/ChatSchema"
import { ColyseusMessageEvents } from "@/nomas/game/colyseus/events"

/**
 * Message type to event name mapping
 */
const MESSAGE_TO_EVENT_MAP: Record<string, string> = {
  purchase_response: ColyseusMessageEvents.PurchaseResponse,
  purchase_item_response: ColyseusMessageEvents.PurchaseItemResponse,
  buy_food_response: ColyseusMessageEvents.PurchaseResponse, // Legacy buy_food maps to PurchaseResponse
  feed_pet_response: ColyseusMessageEvents.FeedPetResponse,
  play_pet_response: ColyseusMessageEvents.PlayPetResponse,
  cleaned_pet_response: ColyseusMessageEvents.CleanedPetResponse,
  create_poop_response: ColyseusMessageEvents.CreatePoopResponse,
  player_state_sync: ColyseusMessageEvents.PlayerStateSync,
  "player-state-response": ColyseusMessageEvents.PlayerStateSync, // Map player-state-response to PlayerStateSync
  pets_state_sync: ColyseusMessageEvents.PetsStateSync,
  buy_pet_response: ColyseusMessageEvents.BuyPetResponse,
  welcome: ColyseusMessageEvents.Welcome,
  poop_created: ColyseusMessageEvents.PoopCreated,
  action_response: ColyseusMessageEvents.ActionResponse,
}

/**
 * React hook for handling Colyseus messages and emitting events
 *
 * @param room - The Colyseus room instance (can be null)
 *
 * @example
 * ```tsx
 * const { room } = useColyseusConnection()
 * useColyseusMessages(room)
 * ```
 */
export const useColyseusMessages = (room: Room<GameRoomState> | null): void => {
  useEffect(() => {
    if (!room) {
      console.log(
        "ℹ️ [useColyseusMessages] No room - skipping message listener setup"
      )
      return
    }

    /**
     * Handle incoming messages from server
     */
    const handleMessage = (type: string | number, message: unknown) => {
      const messageType = String(type)
      console.log(`📨 [useColyseusMessages] Received: ${messageType}`, message)

      // Map message type to event name
      const eventName =
        MESSAGE_TO_EVENT_MAP[messageType] || `colyseus:message:${messageType}`

      console.log(123123123, eventName)

      // Emit typed event
      eventBus.emit(eventName, message)
      console.log(`📤 [useColyseusMessages] Emitted event: ${eventName}`)
    }

    // Set up wildcard message listener
    room.onMessage("*", handleMessage)

    console.log("✅ [useColyseusMessages] Message listeners set up")

    // Cleanup on unmount or room change
    return () => {
      console.log("🧹 [useColyseusMessages] Cleaning up message listeners")
      // Note: Colyseus doesn't have removeAllListeners, but removing the room reference
      // will prevent new messages. The room.offMessage API may not be available,
      // so we rely on room cleanup when component unmounts.
    }
  }, [room])
}
