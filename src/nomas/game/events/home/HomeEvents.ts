/**
 * Home-related event definitions for React ↔ Phaser communication
 *
 * These events replace direct scene method calls from ReactHomeModal,
 * enabling proper decoupling between React UI and Phaser game logic.
 */

import type { PetData } from "@/nomas/game/managers/PetManager"

// Event names for home actions
export const HomeEvents = {
  // Visibility Actions
  OpenHome: "home:open",
  CloseHome: "home:close",
  OpenHomeWithPet: "home:open:with-pet",

  // Data Updates
  PetDataUpdate: "home:pet:data:update",
} as const

// Event payload interfaces

/**
 * Payload for opening home with a specific pet selected
 */
export interface OpenHomeWithPetPayload {
  petId?: string | null
}

/**
 * Payload for pet data updates (emitted periodically from GameScene)
 */
export interface PetDataUpdatePayload {
  pets: PetData[]
  timestamp: number
}
