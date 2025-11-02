/**
 * Colyseus Event Type Definitions
 *
 * This file defines all event types for Colyseus communication using event emitter pattern.
 * Events are categorized as:
 * - Connection events: Room connection/disconnection/errors
 * - Message events: Incoming messages from server (colyseus:message:*)
 * - Action events: Outgoing actions to server (colyseus:action:*)
 */

import type { PetData } from "@/nomas/game/managers/PetManager"

// ===== CONNECTION EVENTS =====

/**
 * Emitted when successfully connected to Colyseus room
 */
export interface ColyseusConnectedEvent {
  roomId: string
  sessionId: string
  roomName?: string
}

/**
 * Emitted when disconnected from Colyseus room
 */
export interface ColyseusDisconnectedEvent {
  code: number
}

/**
 * Emitted when a connection error occurs
 */
export interface ColyseusErrorEvent {
  code: number
  message: string
}

// ===== INCOMING MESSAGE EVENTS (Server → Client) =====

/**
 * Response to purchase request
 * @event colyseus:message:purchase_response
 */
export interface PurchaseResponseMessage {
  success: boolean
  message: string
  currentTokens?: number
}

/**
 * Response to purchase_item request (new purchase system)
 * @event colyseus:message:purchase_item_response
 */
export interface PurchaseItemResponseMessage {
  purchaseId: string
  success: boolean
  message: string
  currentTokens?: number
  itemData?: unknown
}

/**
 * Response to pet actions (feed, play, clean)
 * @event colyseus:message:feed_pet_response
 * @event colyseus:message:play_pet_response
 * @event colyseus:message:cleaned_pet_response
 */
export interface PetActionResponseMessage {
  success: boolean
  message: string
  data?: {
    poopId?: string
  }
  petStats?: {
    hunger?: number
    happiness?: number
    cleanliness?: number
  }
}

/**
 * Response to create_poop request
 * @event colyseus:message:create_poop_response
 */
export interface CreatePoopResponseMessage {
  success: boolean
  data: {
    positionX: number
    positionY: number
    poopId: string
  }
}

/**
 * Player state synchronization from server
 * Can be flat or nested under 'data' property
 * @event colyseus:message:player_state_sync
 */
export interface PlayerStateSyncMessage {
  tokens?: number
  inventory?: unknown
  playerData?: unknown
  // Support nested format
  data?: {
    tokens?: number
    inventory?: unknown
    playerData?: unknown
  }
}

/**
 * Pets state synchronization from server
 * Can be flat or nested under 'data' property
 * @event colyseus:message:pets_state_sync
 */
export interface PetsStateSyncMessage {
  pets?: PetData[]
  // Support nested format
  data?: {
    pets?: PetData[]
  }
}

/**
 * Response to buy_pet request
 * @event colyseus:message:buy_pet_response
 */
export interface BuyPetResponseMessage {
  success: boolean
  message: string
  // currentTokens: number
  data: {
    currentTokens: number
    pets?: PetData[]
  }
}

/**
 * Welcome message from server (triggers initial state request)
 * @event colyseus:message:welcome
 */
export interface WelcomeMessage {
  // Usually empty, just triggers action
  [key: string]: unknown
}

/**
 * Poop created notification from server
 * @event colyseus:message:poop_created
 */
export interface PoopCreatedMessage {
  petId: string
  poopId: string
  positionX: number
  positionY: number
}

// ===== OUTGOING ACTION EVENTS (Client → Server) =====

/**
 * Generic send action (for any message type not covered by specific actions)
 * @event colyseus:action:send
 */
export interface ColyseusSendAction {
  type: string
  data: unknown
}

/**
 * Purchase item action (new purchase system)
 * @event colyseus:action:purchase_item
 */
export interface PurchaseItemAction {
  purchaseId: string
  itemType: string
  itemId: string
  quantity: number
  price: number
}

/**
 * Buy food action (legacy)
 * @event colyseus:action:buy_food
 */
export interface BuyFoodAction {
  itemType: string
  itemName: string
  quantity: number
  itemId: string
}

/**
 * Feed pet action
 * @event colyseus:action:feed_pet
 */
export interface FeedPetAction {
  petId: string
  foodType: string
}

/**
 * Play with pet action
 * @event colyseus:action:play_with_pet
 */
export interface PlayWithPetAction {
  petId: string
}

/**
 * Clean pet action
 * @event colyseus:action:clean_pet
 */
export interface CleanPetAction {
  petId: string
  cleaningItemId: string
  poopId: string
}

/**
 * Buy pet action
 * @event colyseus:action:buy_pet
 */
export interface BuyPetAction {
  petType: string
  petTypeId: string
  isBuyPet: boolean
  x: number
  y: number
}

/**
 * Remove pet action
 * @event colyseus:action:remove_pet
 */
export interface RemovePetAction {
  petId: string
}

/**
 * Create poop action
 * @event colyseus:action:create_poop
 */
export interface CreatePoopAction {
  petId: string
  positionX: number
  positionY: number
}

/**
 * Pet ate food notification
 * @event colyseus:action:eated_food
 */
export interface EatedFoodAction {
  hunger_level: number
  pet_id: string
  owner_id: string
}

/**
 * Pet cleaned notification
 * @event colyseus:action:cleaned_pet
 */
export interface CleanedPetAction {
  cleanliness_level: number
  pet_id: string
  owner_id: string
}

/**
 * Pet played notification
 * @event colyseus:action:played_pet
 */
export interface PlayedPetAction {
  happiness_level: number
  pet_id: string
  owner_id: string
}

/**
 * Request player state action
 * @event colyseus:action:request_player_state
 */
export interface RequestPlayerStateAction {
  // Empty payload
}

/**
 * Request pets state action
 * @event colyseus:action:request_pets_state
 */
export interface RequestPetsStateAction {
  // Empty payload
}

/**
 * Get store catalog action
 * @event colyseus:action:get_store_catalog
 */
export interface GetStoreCatalogAction {
  // Empty payload
}

/**
 * Get inventory action
 * @event colyseus:action:get_inventory
 */
export interface GetInventoryAction {
  // Empty payload
}

/**
 * Cancel purchase action
 * @event colyseus:action:cancel_purchase
 */
export interface CancelPurchaseAction {
  purchaseId: string
}

// ===== EVENT NAME CONSTANTS =====

/**
 * Connection event names
 */
export const ColyseusConnectionEvents = {
    Connected: "colyseus:connected",
    Disconnected: "colyseus:disconnected",
    Error: "colyseus:error",
} as const

/**
 * Incoming message event names (Server → Client)
 */
export enum ColyseusMessageEvents {
  PurchaseResponse = "colyseus:message:purchase_response",
  PurchaseItemResponse = "colyseus:message:purchase_item_response",
  FeedPetResponse = "colyseus:message:feed_pet_response",
  PlayPetResponse = "colyseus:message:play_pet_response",
  CleanedPetResponse = "colyseus:message:cleaned_pet_response",
  CreatePoopResponse = "colyseus:message:create_poop_response",
  PlayerStateSync = "colyseus:message:player_state_sync",
  PetsStateSync = "colyseus:message:pets_state_sync",
  BuyPetResponse = "colyseus:message:buy_pet_response",
  Welcome = "colyseus:message:welcome",
  PoopCreated = "colyseus:message:poop_created",
  ActionResponse = "colyseus:message:action_response",
}

/**
 * Outgoing action event names (Client → Server)
 */
export enum ColyseusActionEvents {
  Send = "colyseus:action:send",
  PurchaseItem = "colyseus:action:purchase_item",
  BuyFood = "colyseus:action:buy_food",
  FeedPet = "colyseus:action:feed_pet",
  PlayWithPet = "colyseus:action:play_with_pet",
  CleanPet = "colyseus:action:clean_pet",
  BuyPet = "colyseus:action:buy_pet",
  RemovePet = "colyseus:action:remove_pet",
  CreatePoop = "colyseus:action:create_poop",
  EatedFood = "colyseus:action:eated_food",
  CleanedPet = "colyseus:action:cleaned_pet",
  PlayedPet = "colyseus:action:played_pet",
  RequestPlayerState = "colyseus:action:request_player_state",
  RequestPetsState = "colyseus:action:request_pets_state",
  GetStoreCatalog = "colyseus:action:get_store_catalog",
  GetInventory = "colyseus:action:get_inventory",
  CancelPurchase = "colyseus:action:cancel_purchase",
}

// ===== TYPE HELPERS =====

/**
 * Union type of all connection event payloads
 */
export type ColyseusConnectionEventPayload =
  | ColyseusConnectedEvent
  | ColyseusDisconnectedEvent
  | ColyseusErrorEvent

/**
 * Union type of all incoming message event payloads
 */
export type ColyseusMessageEventPayload =
  | PurchaseResponseMessage
  | PurchaseItemResponseMessage
  | PetActionResponseMessage
  | CreatePoopResponseMessage
  | PlayerStateSyncMessage
  | PetsStateSyncMessage
  | BuyPetResponseMessage
  | WelcomeMessage
  | PoopCreatedMessage

/**
 * Union type of all outgoing action event payloads
 */
export type ColyseusActionEventPayload =
  | ColyseusSendAction
  | PurchaseItemAction
  | BuyFoodAction
  | FeedPetAction
  | PlayWithPetAction
  | CleanPetAction
  | BuyPetAction
  | RemovePetAction
  | CreatePoopAction
  | EatedFoodAction
  | CleanedPetAction
  | PlayedPetAction
  | RequestPlayerStateAction
  | RequestPetsStateAction
  | GetStoreCatalogAction
  | GetInventoryAction
  | CancelPurchaseAction

/**
 * Event name to payload type mapping
 */
export type ColyseusEventMap = {
  [ColyseusConnectionEvents.Connected]: ColyseusConnectedEvent
  [ColyseusConnectionEvents.Disconnected]: ColyseusDisconnectedEvent
  [ColyseusConnectionEvents.Error]: ColyseusErrorEvent
  [ColyseusMessageEvents.PurchaseResponse]: PurchaseResponseMessage
  [ColyseusMessageEvents.PurchaseItemResponse]: PurchaseItemResponseMessage
  [ColyseusMessageEvents.FeedPetResponse]: PetActionResponseMessage
  [ColyseusMessageEvents.PlayPetResponse]: PetActionResponseMessage
  [ColyseusMessageEvents.CleanedPetResponse]: PetActionResponseMessage
  [ColyseusMessageEvents.CreatePoopResponse]: CreatePoopResponseMessage
  [ColyseusMessageEvents.PlayerStateSync]: PlayerStateSyncMessage
  [ColyseusMessageEvents.PetsStateSync]: PetsStateSyncMessage
  [ColyseusMessageEvents.BuyPetResponse]: BuyPetResponseMessage
  [ColyseusMessageEvents.Welcome]: WelcomeMessage
  [ColyseusMessageEvents.PoopCreated]: PoopCreatedMessage
  [ColyseusActionEvents.Send]: ColyseusSendAction
  [ColyseusActionEvents.PurchaseItem]: PurchaseItemAction
  [ColyseusActionEvents.BuyFood]: BuyFoodAction
  [ColyseusActionEvents.FeedPet]: FeedPetAction
  [ColyseusActionEvents.PlayWithPet]: PlayWithPetAction
  [ColyseusActionEvents.CleanPet]: CleanPetAction
  [ColyseusActionEvents.BuyPet]: BuyPetAction
  [ColyseusActionEvents.RemovePet]: RemovePetAction
  [ColyseusActionEvents.CreatePoop]: CreatePoopAction
  [ColyseusActionEvents.EatedFood]: EatedFoodAction
  [ColyseusActionEvents.CleanedPet]: CleanedPetAction
  [ColyseusActionEvents.PlayedPet]: PlayedPetAction
  [ColyseusActionEvents.RequestPlayerState]: RequestPlayerStateAction
  [ColyseusActionEvents.RequestPetsState]: RequestPetsStateAction
  [ColyseusActionEvents.GetStoreCatalog]: GetStoreCatalogAction
  [ColyseusActionEvents.GetInventory]: GetInventoryAction
  [ColyseusActionEvents.CancelPurchase]: CancelPurchaseAction
}
