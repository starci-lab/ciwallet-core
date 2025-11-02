/**
 * ColyseusService - Service Bridge for Colyseus Communication
 *
 * This service acts as a bridge between Phaser systems and the React hook-based
 * Colyseus connection. It:
 * - Listens to action events from systems
 * - Forwards messages to Colyseus room
 * - Provides typed API methods for backward compatibility
 * - Manages room reference
 *
 * This is a singleton service that can be used across the Phaser game layer.
 */

import { Room } from "colyseus.js"
import { eventBus } from "@/nomas/game/event-bus"
import type { GameRoomState } from "@/nomas/game/schema/ChatSchema"
import {
    ColyseusActionEvents,
    ColyseusConnectionEvents,
    type ColyseusSendAction,
    type PurchaseItemAction,
    type BuyFoodAction,
    type FeedPetAction,
    type PlayWithPetAction,
    type CleanPetAction,
    type BuyPetAction,
    type RemovePetAction,
    type CreatePoopAction,
    type EatedFoodAction,
    type CleanedPetAction,
    type PlayedPetAction,
    type RequestPlayerStateAction,
    type RequestPetsStateAction,
    type GetStoreCatalogAction,
    type GetInventoryAction,
    type CancelPurchaseAction,
} from "@/nomas/game/colyseus/events"

/**
 * ColyseusService - Singleton service for Colyseus communication
 */
export class ColyseusService {
    private static instance: ColyseusService | null = null
    private room: Room<GameRoomState> | null = null
    private petManager: any = null // PetManager reference (optional)
    private gameUI: any = null // GameUI reference (optional)
    private initialized = false

    /**
   * Private constructor for singleton pattern
   */
    private constructor() {
    // Private constructor
    }

    /**
   * Get singleton instance
   */
    static getInstance(): ColyseusService {
        if (!ColyseusService.instance) {
            ColyseusService.instance = new ColyseusService()
        }
        return ColyseusService.instance
    }

    /**
   * Initialize the service - sets up event listeners
   * Should be called once after room is connected
   */
    initialize(): void {
        if (this.initialized) {
            console.warn("⚠️ [ColyseusService] Already initialized")
            return
        }

        console.log("🚀 [ColyseusService] Initializing...")

        // Listen for generic send action
        eventBus.on(ColyseusActionEvents.Send, (action: ColyseusSendAction) => {
            this.sendMessage(action.type, action.data)
        })

        // Listen for specific action events
        eventBus.on(
            ColyseusActionEvents.PurchaseItem,
            (action: PurchaseItemAction) => {
                this.sendMessage("buy_food", action)
            }
        )

        eventBus.on(ColyseusActionEvents.BuyFood, (action: BuyFoodAction) => {
            this.sendMessage("buy_food", action)
        })

        eventBus.on(ColyseusActionEvents.FeedPet, (action: FeedPetAction) => {
            this.sendMessage("feed_pet", action)
        })

        eventBus.on(
            ColyseusActionEvents.PlayWithPet,
            (action: PlayWithPetAction) => {
                this.sendMessage("play_with_pet", action)
            }
        )

        eventBus.on(ColyseusActionEvents.CleanPet, (action: CleanPetAction) => {
            this.sendMessage("cleaned_pet", action)
        })

        eventBus.on(ColyseusActionEvents.BuyPet, (action: BuyPetAction) => {
            this.sendMessage("buy_pet", action)
        })

        eventBus.on(ColyseusActionEvents.RemovePet, (action: RemovePetAction) => {
            this.sendMessage("remove_pet", action)
        })

        eventBus.on(ColyseusActionEvents.CreatePoop, (action: CreatePoopAction) => {
            this.sendMessage("create_poop", action)
        })

        eventBus.on(ColyseusActionEvents.EatedFood, (action: EatedFoodAction) => {
            this.sendMessage("eated_food", action)
        })

        eventBus.on(ColyseusActionEvents.CleanedPet, (action: CleanedPetAction) => {
            this.sendMessage("cleaned_pet", action)
        })

        eventBus.on(ColyseusActionEvents.PlayedPet, (action: PlayedPetAction) => {
            this.sendMessage("played_pet", action)
        })

        eventBus.on(
            ColyseusActionEvents.RequestPlayerState,
            (_action: RequestPlayerStateAction) => {
                this.sendMessage("request_player_state", {})
            }
        )

        eventBus.on(
            ColyseusActionEvents.RequestPetsState,
            (_action: RequestPetsStateAction) => {
                this.sendMessage("request_pets_state", {})
            }
        )

        eventBus.on(
            ColyseusActionEvents.GetStoreCatalog,
            (_action: GetStoreCatalogAction) => {
                this.sendMessage("get_store_catalog", {})
            }
        )

        eventBus.on(
            ColyseusActionEvents.GetInventory,
            (_action: GetInventoryAction) => {
                this.sendMessage("get_inventory", {})
            }
        )

        eventBus.on(
            ColyseusActionEvents.CancelPurchase,
            (action: CancelPurchaseAction) => {
                this.sendMessage("cancel_purchase", action)
            }
        )

        // Listen for room connection/disconnection
        eventBus.on(ColyseusConnectionEvents.Connected, (event) => {
            console.log("✅ [ColyseusService] Room connected:", event.roomId)
            // Room will be set via setRoom() from React hook
        })

        eventBus.on(ColyseusConnectionEvents.Disconnected, () => {
            console.log("👋 [ColyseusService] Room disconnected")
            this.room = null
        })

        this.initialized = true
        console.log("✅ [ColyseusService] Initialized")
    }

    /**
   * Set the Colyseus room instance
   * Called from React hook when room is connected
   */
    setRoom(room: Room<GameRoomState>): void {
        console.log("🔗 [ColyseusService] Setting room:", room.roomId)
        this.room = room
    }

    /**
   * Set PetManager reference (optional, for future use)
   */
    setPetManager(petManager: any): void {
        this.petManager = petManager
    }

    /**
   * Set GameUI reference (optional, for notifications)
   */
    setGameUI(gameUI: any): void {
        this.gameUI = gameUI
    }

    /**
   * Check if connected to room
   */
    isConnected(): boolean {
        return this.room !== null
    }

    /**
   * Get room instance (read-only access)
   */
    getRoom(): Room<GameRoomState> | null {
        return this.room
    }

    /**
   * Send message to server
   * Core method that all other methods use
   */
    sendMessage(type: string, data: unknown): void {
        if (!this.room) {
            console.warn(
                "⚠️ [ColyseusService] Cannot send message - room is null",
                type,
                data
            )
            return
        }

        if (!this.isConnected()) {
            console.warn(
                "⚠️ [ColyseusService] Cannot send message - not connected",
                type,
                data
            )
            return
        }

        try {
            console.log(`📤 [ColyseusService] Sending: ${type}`, data)
            this.room.send(type, data)
        } catch (error) {
            console.error("❌ [ColyseusService] Failed to send message:", type, error)
        }
    }

    // ===== BACKWARD-COMPATIBLE API METHODS =====
    // These methods match ColyseusClient API for easy migration

    /**
   * Purchase item from store (legacy method)
   */
    purchaseItem(
        itemType: string,
        itemName: string,
        quantity: number = 1,
        itemId: string
    ): void {
        this.sendMessage("buy_food", { itemType, itemName, quantity, itemId })
    }

    /**
   * New purchase system method
   */
    purchaseItemV2(
        purchaseId: string,
        itemType: string,
        itemId: string,
        quantity: number,
        price: number
    ): void {
        this.sendMessage("purchase_item", {
            purchaseId,
            itemType,
            itemId,
            quantity,
            price,
        })
    }

    /**
   * Feed pet
   */
    feedPet(petId: string, foodType: string): void {
        this.sendMessage("feed_pet", { petId, foodType })
    }

    /**
   * Play with pet
   */
    playWithPet(petId: string): void {
        this.sendMessage("play_with_pet", { petId })
    }

    /**
   * Clean pet
   */
    cleanPet(petId: string, cleaningItemId: string, poopId: string): void {
        console.log(
            "🧹 [ColyseusService] Cleaning pet:",
            petId,
            cleaningItemId,
            poopId
        )
        this.sendMessage("cleaned_pet", { petId, cleaningItemId, poopId })
    }

    /**
   * Get store catalog
   */
    getStoreCatalog(): void {
        this.sendMessage("get_store_catalog", {})
    }

    /**
   * Get player inventory
   */
    getInventory(): void {
        this.sendMessage("get_inventory", {})
    }

    /**
   * Handle pet eating food
   */
    eatedFood(data: {
    hunger_level: number
    pet_id: string
    owner_id: string
  }): void {
        this.sendMessage("eated_food", data)
    }

    /**
   * Handle pet being cleaned
   */
    cleanedPet(data: {
    cleanliness_level: number
    pet_id: string
    owner_id: string
  }): void {
        this.sendMessage("cleaned_pet", data)
    }

    /**
   * Handle pet playing
   */
    playedPet(data: {
    happiness_level: number
    pet_id: string
    owner_id: string
  }): void {
        this.sendMessage("played_pet", data)
    }

    /**
   * Request player state from server
   */
    requestPlayerState(): void {
        this.sendMessage("request_player_state", {})
    }

    /**
   * Request pets state from server
   */
    requestPetsState(): void {
        this.sendMessage("request_pets_state", {})
    }

    /**
   * Create poop at position
   */
    createPoop(data: {
    petId: string
    positionX: number
    positionY: number
  }): void {
        this.sendMessage("create_poop", data)
    }

    /**
   * Force sync all state from server
   */
    forceSyncState(): void {
        console.log("🔄 [ColyseusService] Force syncing all state from server...")
        this.requestPlayerState()

        // Add delays between requests to avoid overwhelming the connection
        setTimeout(() => {
            this.getStoreCatalog()
        }, 1000)

        setTimeout(() => {
            this.getInventory()
        }, 1500)

        console.log("📤 [ColyseusService] Sync requests sent")
    }

    /**
   * Cleanup - remove event listeners
   * Should be called when service is no longer needed
   */
    destroy(): void {
        console.log("🧹 [ColyseusService] Destroying service...")

        // Remove all event listeners
        eventBus.off(ColyseusActionEvents.Send)
        eventBus.off(ColyseusActionEvents.PurchaseItem)
        eventBus.off(ColyseusActionEvents.BuyFood)
        eventBus.off(ColyseusActionEvents.FeedPet)
        eventBus.off(ColyseusActionEvents.PlayWithPet)
        eventBus.off(ColyseusActionEvents.CleanPet)
        eventBus.off(ColyseusActionEvents.BuyPet)
        eventBus.off(ColyseusActionEvents.RemovePet)
        eventBus.off(ColyseusActionEvents.CreatePoop)
        eventBus.off(ColyseusActionEvents.EatedFood)
        eventBus.off(ColyseusActionEvents.CleanedPet)
        eventBus.off(ColyseusActionEvents.PlayedPet)
        eventBus.off(ColyseusActionEvents.RequestPlayerState)
        eventBus.off(ColyseusActionEvents.RequestPetsState)
        eventBus.off(ColyseusActionEvents.GetStoreCatalog)
        eventBus.off(ColyseusActionEvents.GetInventory)
        eventBus.off(ColyseusActionEvents.CancelPurchase)

        // Cleanup
        this.room = null
        this.petManager = null
        this.gameUI = null
        this.initialized = false

        console.log("✅ [ColyseusService] Destroyed")
    }
}

/**
 * Export singleton instance getter
 */
export const colyseusService = ColyseusService.getInstance()
