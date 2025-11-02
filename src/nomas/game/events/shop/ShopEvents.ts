/**
 * Shop-related event definitions for React ↔ Phaser communication
 *
 * These events replace direct scene method calls from ReactShopModal,
 * enabling proper decoupling between React UI and Phaser game logic.
 */

// Event names for shop actions
export const ShopEvents = {
    // Modal Actions
    OpenShop: "shop:open",
    CloseShop: "shop:close",

    // Purchase Actions
    BuyPet: "shop:buy:pet",

    // Placement Actions (for food, toys, cleaning items - deferred purchase)
    StartPlacing: "shop:place:start",
    CancelPlacing: "shop:place:cancel",

    // Immediate Purchase Actions
    BuyFurniture: "shop:buy:furniture",
    BuyBackground: "shop:buy:background",

    // Cursor Actions
    ActivateCursor: "shop:cursor:activate",
    DeactivateCursor: "shop:cursor:deactivate",
} as const

// Event payload interfaces

/**
 * Payload for buying a pet (immediate purchase)
 */
export interface BuyPetPayload {
  petType: string
  petId: string
  petName: string
}

/**
 * Payload for starting placement mode (food, toys, cleaning items)
 * Purchase is deferred until user clicks in scene
 */
export interface BuyPlaceableItemPayload {
  itemType: "food" | "toy" | "clean"
  itemId: string
  itemName: string
  cursorUrl: string
}

/**
 * Payload for immediate purchase items (furniture, backgrounds)
 */
export interface BuyImmediateItemPayload {
  itemType: "furniture" | "background"
  itemId: string
  itemName: string
}

/**
 * Payload for activating custom cursor
 */
export interface ActivateCursorPayload {
  cursorUrl: string
  cursorSize?: number
  frameWidth?: number // For sprite sheet cursors (e.g., cleaning items)
  frameIndex?: number // For sprite sheet cursors
}
