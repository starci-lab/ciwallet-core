/* eslint-disable indent */
import { Pet } from "../entities/Pet"
import {
  GAME_LAYOUT,
  GAME_MECHANICS,
  GamePositioning,
} from "@/nomas/game/constants/gameConstants"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import type { ColyseusClient } from "@/nomas/game/colyseus/client"
import { spendToken, store } from "@/nomas/redux"
import { PetsDB } from "@/nomas/utils/idb"

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

export class CleanlinessSystem {
  // Public properties - quản lý poop objects và cleaning inventory
  public cleaningInventory: number = 0 // Số lượng broom có trong inventory
  public cleanlinessLevel: number = 100 // Cleanliness level similar to hungerLevel in FeedingSystem
  public poopObjects: Phaser.GameObjects.Sprite[] = []
  public poopShadows: Phaser.GameObjects.Ellipse[] = []

  // Private properties
  private lastCleanlinessUpdate: number = 0
  private lastPoopCheck: number = 0
  private lastPoopTime: number = 0 // Track when last poop was created
  private scene: Phaser.Scene
  private pet: Pet
  private colyseusClient: ColyseusClient
  private petId: string

  constructor(
    scene: Phaser.Scene,
    pet: Pet,
    colyseusClient: ColyseusClient,
    petId: string
  ) {
    this.scene = scene
    this.pet = pet
    this.colyseusClient = colyseusClient
    this.petId = petId

    // Create poop animation
    this.createPoopAnimation()
    this.setupPoopEventListeners()
  }

  private setupPoopEventListeners() {
    if (this.colyseusClient.room) {
      this.colyseusClient.room.onMessage("poop_created", (message) => {
        console.log("💩 Poop created:", message)
      })
    }
  }

  // ===== ANIMATION SETUP =====

  private createPoopAnimation() {
    // Create poop animation from atlas frames
    console.log("🎬 Creating poop animation...")
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
      console.log("✅ Poop animation created successfully")
    } catch (error) {
      console.error("❌ Failed to create poop animation:", error)
    }

    // Create broom animation from atlas frames
    console.log("Creating broom animation...")
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

  // ===== UPDATE LOOP =====

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

  // TODO: UPDATE POOP SYSTEM
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
        (now - this.lastPoopCheck > GAME_MECHANICS.POOP_CHECK_INTERVAL &&
          timeSinceLastPoop >= 10)
      ) {
        await PetsDB.setPoopCount(this.petId, poopCount + 1)
        this.dropPoop()
        this.lastPoopCheck = now
        this.lastPoopTime = now
        return
      }
    }
  }

  // ===== POOP MANAGEMENT =====
  // TODO: UPDATE POOP SYSTEM
  private dropPoop() {
    const petX = this.pet.sprite.x
    const petY = GAME_LAYOUT.POOP_GROWN_OFFSET

    if (this.colyseusClient && this.colyseusClient.isConnected()) {
      this.colyseusClient.createPoop({
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
    console.log(
      `💩 [CREATE] Creating poop at original position (${x}, ${y}) ID: ${poopId}`
    )

    // ✨ THÊM: Clamp position to current scene bounds
    const scene = this.scene
    const width = scene.scale.width
    const height = scene.scale.height
    const margin = 50 // Khoảng cách tối thiểu từ mép

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
      const poop = this.scene.add.sprite(clampedX, poopY, "poop")

      // Use responsive scale
      const responsiveScale =
        GamePositioning.getResponsivePoopScale(cameraWidth)
      poop.setScale(responsiveScale)

      // Store original scale for resize
      poop.setData("originalScale", GAME_LAYOUT.POOP_SCALE)

      poop.setAlpha(1.0)
      poop.setDepth(2000)
      poop.setOrigin(0.5, 0.5)

      // Store poop ID if provided (for server sync)
      if (poopId) {
        ;(poop as unknown as { poopId: string }).poopId = poopId
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

      console.log(
        `Poop created at (${clampedX}, ${clampedY}). Total: ${this.poopObjects.length}`
      )

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
    console.log(`🧹 [CLEAR] Clearing ${this.poopObjects.length} poops...`)

    const count = this.poopObjects.length
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }

    console.log(`✅ Cleared ${count} poops`)
  }

  /**
   * Public method để sync nhiều poops từ server
   * @param poopsData - Array of poop data from server
   */
  public syncPoops(
    poopsData: Array<{ id: string; positionX: number; positionY: number }>
  ): void {
    console.log(`[SYNC] Syncing ${poopsData.length} poops...`)

    // Clear existing poops first
    this.clearAllPoops()

    // Create new poops from server data
    let successCount = 0
    poopsData.forEach((poopData) => {
      const poop = this.createPoopAt(
        poopData.positionX,
        poopData.positionY,
        poopData.id
      )
      if (poop) successCount++
    })

    console.log(
      `[SYNC] Synced ${successCount}/${poopsData.length} poops successfully`
    )
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
      (poop) => (poop as unknown as { poopId: string }).poopId === poopId
    )

    if (poopIndex !== -1) {
      console.log(
        `Removing poop with ID: ${poopId}, animation: ${playAnimation}`
      )
      this.removePoopAtIndex(poopIndex, playAnimation)

      // Increase cleanliness when cleaning poop
      this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 10)

      return true
    }

    console.log(`Poop with ID ${poopId} not found`)
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
      this.removePoopAtIndex(poopIndex)

      // Increase cleanliness when cleaning poop
      this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 10)

      // Send cleaned pet event to server if connected
      if (this.colyseusClient && this.colyseusClient.isConnected()) {
        // const userStore = useUserStore.getState();
        const userStore = store.getState().stateless.user
        this.colyseusClient.cleanedPet({
          cleanliness_level: this.cleanlinessLevel,
          pet_id: this.petId,
          owner_id: userStore.addressWallet || "unknown",
        })
      }

      return true
    }
    return false
  }

  // ===== CLEANING MANAGEMENT =====

  buyAndCleaning(cleaningId: string, poopId: string): boolean {
    console.log(`Buying cleaning item: ${cleaningId}`)
    const price = gameConfigManager.getCleaningPrice(cleaningId)
    if (this.colyseusClient && this.colyseusClient.isConnected()) {
      console.log("Checking tokens before sending purchase request to server")

      // Check if player has enough tokens before sending to server
      // const currentTokens = useUserStore.getState().nomToken
      const currentTokens = store.getState().stateless.user.nomToken
      if (currentTokens < price) {
        console.log(`Not enough tokens: need ${price}, have ${currentTokens}`)
        return false
      }

      // Get cleaning item to retrieve both id and name
      const cleaningItem = gameConfigManager.getCleaningItem(cleaningId)
      this.colyseusClient.cleanPet(this.petId, cleaningItem?.id || "", poopId)

      return true // Server will handle validation and update inventory
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

    console.log("No cleaning items in inventory")
    return false
  }

  private cleanAllPoop(): void {
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }
  }

  // ===== CLEANUP =====

  destroy(): void {
    this.cleanup()
  }

  cleanup() {
    while (this.poopObjects.length > 0) {
      this.removePoopAtIndex(0)
    }
  }
}
