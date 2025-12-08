/* eslint-disable indent */
import { Pet } from "../entities/Pet"
import {
  GAME_LAYOUT,
  GAME_MECHANICS,
  GamePositioning,
} from "@/nomas/game/constants/gameConstants"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import { colyseusService } from "@/nomas/game/colyseus/ColyseusService"
import { spendToken, store } from "@/nomas/redux"
import { PetsDB } from "@/nomas/utils/idb"
import { eventBus } from "@/nomas/game/event-bus"
import { ColyseusMessageEvents } from "@/nomas/game/colyseus/events"

// Cleanliness states
export const CleanlinessState = {
  Clean: "clean",
  Normal: "normal",
  Dirty: "dirty",
  Filthy: "filthy",
} as const
export type CleanlinessState =
  (typeof CleanlinessState)[keyof typeof CleanlinessState]

export function getCleanlinessState(
  cleanlinessLevel: number
): CleanlinessState {
  if (cleanlinessLevel >= 95) return CleanlinessState.Clean
  if (cleanlinessLevel >= 80) return CleanlinessState.Normal
  if (cleanlinessLevel >= 30) return CleanlinessState.Dirty
  return CleanlinessState.Filthy
}

// Extended Sprite type with poopId
interface PoopSprite extends Phaser.GameObjects.Sprite {
  poopId?: string
}

export class CleanlinessSystem {
  // Public properties - quản lý poop objects và cleaning inventory
  public cleaningInventory: number = 0
  public cleanlinessLevel: number = 100
  public poopObjects: PoopSprite[] = []
  public poopShadows: Phaser.GameObjects.Ellipse[] = []

  // Private properties
  private lastCleanlinessUpdate: number = 0
  private lastPoopCheck: number = 0
  private lastPoopTime: number = 0
  private scene: Phaser.Scene
  private pet: Pet
  private petId: string

  // Event handlers (stored for cleanup)
  private handlePoopCreated?: (message: {
    petId: string
    poopId: string
    positionX: number
    positionY: number
  }) => void
  private handleCreatePoopResponse?: (message: {
    success: boolean
    data?: {
      positionX: number
      positionY: number
      poopId: string
    }
  }) => void
  private handleCleanedPetResponse?: (message: {
    success: boolean
    message: string
    data?: {
      poopId?: string
      petId?: string
    }
    petStats?: {
      hunger?: number
      happiness?: number
      cleanliness?: number
    }
  }) => void

  constructor(
    scene: Phaser.Scene,
    pet: Pet,
    _colyseusClient: unknown,
    petId: string
  ) {
    this.scene = scene
    this.pet = pet
    this.petId = petId
    // Create poop animation
    this.createPoopAnimation()

    // Setup event listeners for poop management
    this.setupEventListeners()

    console.log(`[CleanlinessSystem] Initialized for pet ${petId}`)
  }

  private setupEventListeners() {
    // Listen to poop_created (broadcast from server)
    this.handlePoopCreated = (message: {
      petId: string
      poopId: string
      positionX: number
      positionY: number
    }) => {
      // Only handle if this poop belongs to this pet
      if (message.petId === this.petId) {
        this.createPoopAt(message.positionX, message.positionY, message.poopId)
      } else {
        console.log(
          `[CleanlinessSystem] Ignoring poop - not for this pet (${this.petId})`
        )
      }
    }

    // Listen to create_poop_response (response when we create poop)
    this.handleCreatePoopResponse = (message: {
      success: boolean
      data?: {
        positionX: number
        positionY: number
        poopId: string
        petId?: string
      }
    }) => {
      if (message.success && message.data) {
        // Check if this response is for this pet
        if (message.data.petId && message.data.petId !== this.petId) {
          console.log(
            `[CleanlinessSystem ${this.petId}] Ignoring poop response - not for this pet (${message.data.petId})`
          )
          return
        }
        // Fallback: Create poop if it doesn't exist yet
        // This handles cases where poop_created broadcast might be missed
        const existingPoop = this.poopObjects.find(
          (poop) => poop.poopId === message.data!.poopId
        )

        if (!existingPoop) {
          this.createPoopAt(
            message.data.positionX,
            message.data.positionY,
            message.data.poopId
          )
        } else {
          console.log(
            `[CleanlinessSystem ${this.petId}] Poop already exists, skipping duplicate creation`
          )
        }
      } else {
        console.warn(
          `[CleanlinessSystem ${this.petId}] Poop creation failed:`,
          message
        )
      }
    }

    // Listen to cleaned_pet_response (response when we clean poop)
    this.handleCleanedPetResponse = async (message: {
      success: boolean
      message: string
      data?: {
        poopId?: string
        petId?: string
      }
      petStats?: {
        hunger?: number
        happiness?: number
        cleanliness?: number
      }
    }) => {
      console.log("[CleanlinessSystem] Cleaned pet response:", message)

      // Only handle if this response is for this pet
      if (message.data?.petId === this.petId) {
        if (message.success && message.data?.poopId) {
          const poopId = message.data.poopId
          const removed = this.removePoopById(poopId, true)

          if (removed) {
            console.log(
              `[CleanlinessSystem] Poop ${poopId} removed from pet ${this.petId}`
            )
            const poopCount = await PetsDB.getPoopCount(this.petId)
            await PetsDB.setPoopCount(this.petId, +poopCount - 1)

            // Update cleanliness from server if provided
            if (message.petStats?.cleanliness !== undefined) {
              this.cleanlinessLevel = message.petStats.cleanliness
            }
          } else {
            console.warn(`[CleanlinessSystem] Poop ${poopId} not found`)
          }
        } else {
          console.warn(
            "[CleanlinessSystem] Cleaning failed or no poopId:",
            message
          )
        }
      }
    }

    // Register event listeners
    eventBus.on(ColyseusMessageEvents.PoopCreated, this.handlePoopCreated)
    eventBus.on(
      ColyseusMessageEvents.CreatePoopResponse,
      this.handleCreatePoopResponse
    )
    eventBus.on(
      ColyseusMessageEvents.CleanedPetResponse,
      this.handleCleanedPetResponse
    )

    // Cleanup on scene shutdown
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupEventListeners()
    })
  }

  /**
   * Cleanup event listeners
   */
  private cleanupEventListeners() {
    if (this.handlePoopCreated) {
      eventBus.off(ColyseusMessageEvents.PoopCreated, this.handlePoopCreated)
    }
    if (this.handleCreatePoopResponse) {
      eventBus.off(
        ColyseusMessageEvents.CreatePoopResponse,
        this.handleCreatePoopResponse
      )
    }
    if (this.handleCleanedPetResponse) {
      eventBus.off(
        ColyseusMessageEvents.CleanedPetResponse,
        this.handleCleanedPetResponse
      )
    }
  }

  // ===== ANIMATION SETUP =====

  private createPoopAnimation() {
    // Create poop animation from atlas frames
    try {
      this.scene.anims.create({
        key: "poop-animation",
        frames: this.scene.anims.generateFrameNames("poop", {
          prefix: "broom #Shit ",
          suffix: ".aseprite",
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      })
    } catch (error) {
      console.error("Failed to create poop animation:", error)
    }

    // Create broom animation from atlas frames
    try {
      this.scene.anims.create({
        key: "broom-animation",
        frames: this.scene.anims.generateFrameNames("broom", {
          prefix: "broom #Broom ",
          suffix: ".aseprite",
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: 0, // Play once
      })
      console.log("Broom animation created successfully")
    } catch (error) {
      console.error(" Failed to create broom animation:", error)
    }
  }

  // ===== UPDATE LOOP UPODATE STATE POOP =====
  update() {
    this.updateCleanliness()
    this.checkPoopOpportunity().catch(console.error)
  }

  private updateCleanliness() {
    const now = this.scene.time.now
    if (!this.lastCleanlinessUpdate) this.lastCleanlinessUpdate = now

    const elapsed = (now - this.lastCleanlinessUpdate) / 1000
    const decreaseRate =
      (GAME_MECHANICS.CLEANLINESS_DECREASE_PER_HOUR / 3600) *
      this.pet.cleanlinessDecreaseMultiplier

    if (elapsed > 0) {
      this.cleanlinessLevel = Math.max(
        0,
        this.cleanlinessLevel - decreaseRate * elapsed
      )
      this.lastCleanlinessUpdate = now
    }
  }

  private async checkPoopOpportunity() {
    const poopCount = await PetsDB.getPoopCount(this.petId)
    if (poopCount >= 3) return
    const cleanlinessState = getCleanlinessState(this.cleanlinessLevel)
    const shouldPoop =
      !this.pet.isChasing &&
      this.pet.currentActivity !== "chew" &&
      (cleanlinessState === CleanlinessState.Dirty ||
        cleanlinessState === CleanlinessState.Filthy) &&
      this.cleanlinessLevel < GAME_MECHANICS.POOP_THRESHOLD
    if (shouldPoop) {
      const now = this.scene.time.now
      // Add minimum 10 seconds between poops to prevent spam
      const timeSinceLastPoop = (now - this.lastPoopTime) / 1000

      if (
        !this.lastPoopCheck ||
        // TODO: handle time create poop
        (now - this.lastPoopCheck > GAME_MECHANICS.POOP_CHECK_INTERVAL &&
          timeSinceLastPoop >= 2)
      ) {
        // Don't update DB here - let createPoopAt handle it when poop is actually created
        console.log(`💩 [POOP] Requesting poop creation for pet ${this.petId}`)
        this.dropPoop()
        this.lastPoopCheck = now
        this.lastPoopTime = now
        return
      }
    }
  }

  // ===== POOP MANAGEMENT =====
  private dropPoop() {
    const petX = this.pet.sprite.x
    const petY = GAME_LAYOUT.POOP_GROWN_OFFSET

    if (colyseusService.isConnected()) {
      colyseusService.createPoop({
        petId: this.petId,
        positionX: petX,
        positionY: petY,
      })
    }
  }

  /**
   * Public method để vẽ poop tại vị trí cụ thể
   * Dùng cho sync từ server hoặc tạo poop mới
   * @param x - Vị trí X
   * @param y - Vị trí Y
   * @param poopId - ID của poop (optional, cho tracking)
   * @returns Poop sprite đã tạo
   */
  public createPoopAt(
    x: number,
    y: number,
    poopId: string
  ): Phaser.GameObjects.Sprite | null {
    const existingPoop = this.poopObjects.find((poop) => poop.poopId === poopId)

    if (existingPoop) {
      return existingPoop
    }

    // THÊM: Clamp position to current scene bounds
    const scene = this.scene
    const width = scene.scale.width
    const height = scene.scale.height
    // Khoảng cách tối thiểu từ mép
    const margin = 50

    // Clamp X và Y trong bounds của màn hình hiện tại
    const clampedX = Phaser.Math.Clamp(x, margin, width - margin)
    const clampedY = Phaser.Math.Clamp(y, margin, height - margin)

    // Log warning nếu vị trí bị điều chỉnh
    if (clampedX !== x || clampedY !== y) {
      console.warn(
        `Position adjusted to fit screen:(${x}, ${y}) → (${clampedX}, ${clampedY})`,
        `Screen: ${width}x${height}`
      )
    }

    try {
      // Use responsive Y position based on camera height and width
      const cameraWidth = this.scene.cameras.main.width
      const cameraHeight = this.scene.cameras.main.height
      const poopY =
        GamePositioning.getPoopY(cameraHeight, cameraWidth) -
        GAME_LAYOUT.POOP_GROWN_OFFSET

      // Create poop sprite với vị trí đã clamp và Y responsive
      const poop = this.scene.add.sprite(clampedX, poopY, "poop") as PoopSprite

      // Use responsive scale
      const responsiveScale =
        GamePositioning.getResponsivePoopScale(cameraWidth)
      poop.setScale(responsiveScale)

      // Store original scale for resize
      poop.setData("originalScale", GAME_LAYOUT.POOP_SCALE)

      poop.setAlpha(1.0)
      poop.setDepth(2000)
      poop.setOrigin(0.5, 0.5)

      // Store poop ID (required for server sync and deletion)
      poop.poopId = poopId
      if (!poopId) {
        console.error(
          "❌ [CREATE] CRITICAL: Poop created without poopId! This will cause ghost poop."
        )
      }

      // Set frame
      try {
        poop.setFrame("broom #Shit 0.aseprite")
      } catch (e) {
        console.warn("Could not set poop frame:", e)
      }

      // Play animation
      try {
        poop.play("poop-animation")
      } catch (error) {
        console.warn("Failed to play poop animation:", error)
      }

      // Create shadow with responsive Y position
      const shadow = this.scene.add.ellipse(
        clampedX,
        poopY + 5,
        20,
        10,
        0x000000,
        0.3
      )
      shadow.setDepth(1999)

      // Add to arrays
      this.poopObjects.push(poop)
      this.poopShadows.push(shadow)

      // Update DB count when actually creating poop on UI
      PetsDB.getPoopCount(this.petId).then((count) => {
        const newCount = count + 1
        PetsDB.setPoopCount(this.petId, newCount)
        // Verify sync
        if (this.poopObjects.length !== newCount) {
          console.warn(
            `[CREATE] MISMATCH! UI=${this.poopObjects.length}, DB=${newCount}`
          )
        }
      })

      return poop
    } catch (error) {
      console.error("Failed to create poop:", error)
      return null
    }
  }

  /**
   * Update scales and positions of all poop objects (for responsive design)
   */
  public updatePoopScales(): void {
    const cameraWidth = this.scene.cameras.main.width
    const cameraHeight = this.scene.cameras.main.height
    const responsiveScale = GamePositioning.getResponsivePoopScale(cameraWidth)
    // Use same Y calculation as createPoopAt() to maintain consistency
    const poopY =
      GamePositioning.getPoopY(cameraHeight, cameraWidth) -
      GAME_LAYOUT.POOP_GROWN_OFFSET

    this.poopObjects.forEach((poop) => {
      if (poop && poop.active) {
        poop.setScale(responsiveScale)
        // Update Y position to keep poop at correct ground level
        poop.y = poopY
      }
    })

    // Also update shadow positions
    this.poopShadows.forEach((shadow, index) => {
      if (shadow && shadow.active && this.poopObjects[index]) {
        shadow.y = poopY + 5
      }
    })
  }

  /**
   * Public method để xóa tất cả poops hiện tại
   * Dùng trước khi sync poops từ server
   */
  public clearAllPoops(): void {
    console.log(`[CLEAR] Clearing ${this.poopObjects.length} poops...`)
    const count = this.poopObjects.length
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }

    console.log(`Cleared ${count} poops`)
  }

  /**
   * Public method để sync nhiều poops từ server
   * @param poopsData - Array of poop data from server
   */
  public syncPoops(
    poopsData: Array<{ id: string; positionX: number; positionY: number }>
  ): void {
    // Clear existing poops first
    this.clearAllPoops()

    // Create new poops from server data
    poopsData.forEach((poopData) => {
      this.createPoopAt(poopData.positionX, poopData.positionY, poopData.id)
    })
  }

  private removePoopAtIndex(index: number, playAnimation: boolean = false) {
    if (index < 0 || index >= this.poopObjects.length) return

    const poop = this.poopObjects[index]
    const shadow = this.poopShadows[index]

    // Only play broom animation if explicitly requested (user click)
    if (playAnimation) {
      try {
        const broom = this.scene.add.sprite(poop.x, poop.y - 20, "broom")
        broom.setScale(0.8)
        broom.setDepth(poop.depth + 1)

        // Set initial frame
        broom.setFrame("broom #Broom 0.aseprite")

        // Play broom animation
        broom.play("broom-animation")

        // Destroy broom after animation completes
        broom.on("animationcomplete", () => {
          broom.destroy()
        })

        // Also destroy broom after 600ms as fallback
        this.scene.time.delayedCall(600, () => {
          if (broom && broom.active) {
            broom.destroy()
          }
        })
      } catch (error) {
        console.warn("Failed to play broom animation:", error)
      }
    }

    // Animate poop removal with slight delay if animation is playing
    const delay = playAnimation ? 200 : 0
    this.scene.time.delayedCall(delay, () => {
      this.scene.tweens.add({
        targets: poop,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 300,
        ease: "Power2.easeIn",
        onComplete: () => poop.destroy(),
      })

      this.scene.tweens.add({
        targets: shadow,
        alpha: 0,
        duration: 300,
        onComplete: () => shadow.destroy(),
      })
    })

    // Remove from arrays
    this.poopObjects.splice(index, 1)
    this.poopShadows.splice(index, 1)
  }

  /**
   * Public method to remove poop by ID
   * @param poopId - The ID of the poop to remove
   * @param playAnimation - Whether to play broom cleaning animation (true for user click, false for sync)
   * @returns true if poop was found and removed, false otherwise
   */
  public removePoopById(
    poopId: string,
    playAnimation: boolean = false
  ): boolean {
    const poopIndex = this.poopObjects.findIndex(
      (poop) => poop.poopId === poopId
    )

    if (poopIndex !== -1) {
      this.removePoopAtIndex(poopIndex, playAnimation)

      // Increase cleanliness when cleaning poop
      this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 10)

      // Update DB count when actually removing poop from UI
      PetsDB.getPoopCount(this.petId).then((count) => {
        const newCount = Math.max(0, count - 1)
        PetsDB.setPoopCount(this.petId, newCount)
      })

      return true
    }

    console.warn(
      `❌ [REMOVE] Poop with ID ${poopId} not found in ${this.poopObjects.length} poops`
    )
    return false
  }

  // ===== PUBLIC METHODS =====

  findPoop(x: number, y: number): Phaser.GameObjects.Sprite | null {
    const poopIndex = this.poopObjects.findIndex(
      (poop) => Phaser.Math.Distance.Between(poop.x, poop.y, x, y) < 40
    )
    if (poopIndex !== -1) {
      return this.poopObjects[poopIndex]
    }
    return null
  }

  cleanPoop(x: number, y: number): boolean {
    const poopIndex = this.poopObjects.findIndex(
      (poop) => Phaser.Math.Distance.Between(poop.x, poop.y, x, y) < 40
    )

    if (poopIndex !== -1) {
      const poop = this.poopObjects[poopIndex]
      const poopId = poop.poopId

      // Don't remove locally yet - wait for server confirmation
      // this.removePoopAtIndex(poopIndex)

      // Send to server if connected
      if (colyseusService.isConnected()) {
        if (!poopId) {
          return false
        }

        // Use cleanPet method which expects petId, cleaningItemId (empty for manual clean), and poopId
        // Server will handle the removal and send back cleaned_pet_response
        colyseusService.cleanPet(this.petId, "", poopId)

        console.log(`[CLEAN] Sent clean request to server for poop ${poopId}`)

        // Don't remove locally - wait for server response via cleaned_pet_response
      } else {
        // Offline mode - remove immediately
        this.removePoopAtIndex(poopIndex, true)
        this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 10)

        // Update DB in offline mode
        PetsDB.getPoopCount(this.petId).then((count) => {
          PetsDB.setPoopCount(this.petId, Math.max(0, count - 1))
        })
      }

      return true
    }
    return false
  }

  // ===== CLEANING MANAGEMENT =====

  buyAndCleaning(cleaningId: string, poopId: string): boolean {
    const price = gameConfigManager.getCleaningPrice(cleaningId)
    if (colyseusService.isConnected()) {
      console.log("Checking tokens before sending purchase request to server")

      // Check if player has enough tokens before sending to server
      // const currentTokens = useUserStore.getState().nomToken
      const currentTokens = store.getState().stateless.user.nomToken
      if (currentTokens < price) {
        console.log(`Not enough tokens: need ${price}, have ${currentTokens}`)
        return false
      }

      // Verify poopId exists locally before sending to server
      const poopExists = this.poopObjects.some((p) => p.poopId === poopId)
      if (!poopExists) {
        console.warn(
          `⚠️ [BUY_CLEAN] Poop ${poopId} not found locally! Server will likely reject.`
        )
      }

      // Get cleaning item to retrieve both id and name
      const cleaningItem = gameConfigManager.getCleaningItem(cleaningId)
      console.log(
        `📤 [BUY_CLEAN] Sending to server: petId=${this.petId}, cleaningItemId=${cleaningItem?.id}, poopId=${poopId}`
      )
      colyseusService.cleanPet(this.petId, cleaningItem?.id || "", poopId)

      // Server will handle validation and update inventory
      return true
    } else {
      console.log("Offline mode - using local validation")

      // const userState = useUserStore.getState()
      if (store.dispatch(spendToken(price))) {
        this.cleaningInventory += 1

        console.log(
          `Purchase successful: ${cleaningId} for ${price} tokens. Inventory: ${this.cleaningInventory}`
        )
        return true
      }

      console.log(
        `Not enough tokens to buy ${cleaningId}. Need: ${price}, Have: ${
          store.getState().stateless.user.nomToken
        }`
      )
      return false
    }
  }

  useCleaning(): boolean {
    if (this.cleaningInventory > 0) {
      this.cleaningInventory -= 1

      // Increase pet's cleanliness significantly when using cleaning item
      this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 30)

      // Clean all nearby poop automatically
      this.cleanAllPoop()

      console.log(
        `Used cleaning item! Cleanliness: ${this.cleanlinessLevel}%, Inventory: ${this.cleaningInventory}`
      )
      return true
    }
    return false
  }

  private cleanAllPoop(): void {
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }
  }

  // ===== CLEANUP =====

  destroy(): void {
    this.cleanupEventListeners()
    this.cleanup()
  }

  cleanup() {
    // Clean up all poops
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }
  }
}
