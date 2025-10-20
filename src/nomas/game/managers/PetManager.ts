import { Pet } from "@/nomas/game/entities/Pet"
import { FeedingSystem } from "@/nomas/game/systems/FeedingSystem"
import { CleanlinessSystem } from "@/nomas/game/systems/CleanlinessSystem"
import { HappinessSystem } from "@/nomas/game/systems/HappinessSystem"
import { MovementSystem } from "@/nomas/game/systems/MovementSystem"
import { ActivitySystem } from "@/nomas/game/systems/ActivitySystem"
import { ColyseusClient } from "@/nomas/game/colyseus/client"
import {
  GamePositioning,
  GAME_MECHANICS,
  GAME_LAYOUT,
} from "@/nomas/game/constants/gameConstants"
import { addToken, store } from "@/nomas/redux"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"

export interface PetData {
  id: string
  pet: Pet
  feedingSystem: FeedingSystem
  cleanlinessSystem: CleanlinessSystem
  happinessSystem: HappinessSystem
  movementSystem: MovementSystem
  activitySystem: ActivitySystem
}

export class PetManager {
  private pets: Map<string, PetData> = new Map()
  private scene: Phaser.Scene
  private colyseusClient: ColyseusClient
  private activePetId: string | null = null

  // Shared food pool for all pets
  private sharedDroppedFood: Phaser.GameObjects.Sprite[] = []
  private sharedFoodShadows: Phaser.GameObjects.Ellipse[] = []
  private sharedFoodTimers: Phaser.Time.TimerEvent[] = []

  // Shared ball pool for all pets
  private sharedDroppedBalls: Phaser.GameObjects.Sprite[] = []
  private sharedBallShadows: Phaser.GameObjects.Ellipse[] = []
  private sharedBallTimers: Phaser.Time.TimerEvent[] = []

  // Track which pet is chasing which food to prevent conflicts
  private foodTargets: Map<Phaser.GameObjects.Sprite, string> = new Map() // food -> petId

  // Track which pet is chasing which ball to prevent conflicts
  private ballTargets: Map<Phaser.GameObjects.Sprite, string> = new Map() // ball -> petId

  // Safety timer to prevent pets getting stuck
  private safetyTimer?: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, colyseusClient: ColyseusClient) {
    this.scene = scene
    this.colyseusClient = colyseusClient

    // Start safety check timer every 5 seconds
    this.startSafetyCheck()
  }

  /**
   * Tạo pet entity local (chỉ render, không gửi event mua pet)
   */
  createPet(
    petId: string,
    x: number,
    y: number,
    petType: string = "chog"
  ): PetData {
    console.log(`🐕 Creating pet entity: ${petId} (type: ${petType})`)
    const pet = new Pet(this.scene, petType)
    pet.createAnimations()
    pet.create(x, y)

    // Set click callback with petId
    pet.setOnPetClicked(() => {
      this.handlePetClick(petId)
    })

    // Set right-click callback to show pet details
    pet.setOnPetRightClicked(() => {
      this.handlePetRightClick(petId)
    })

    const movementSystem = new MovementSystem(pet, this.scene)
    const activitySystem = new ActivitySystem(pet)
    const feedingSystem = new FeedingSystem(
      this.scene,
      pet,
      this.colyseusClient,
      petId
    )
    const cleanlinessSystem = new CleanlinessSystem(
      this.scene,
      pet,
      this.colyseusClient,
      petId
    )
    const happinessSystem = new HappinessSystem(pet, this.colyseusClient, petId)

    const petData: PetData = {
      id: petId,
      pet,
      feedingSystem,
      cleanlinessSystem,
      happinessSystem,
      movementSystem,
      activitySystem,
    }
    pet.onStopChasing = () => {
      this.releaseFoodTarget(petId)
    }
    this.pets.set(petId, petData)
    if (!this.activePetId) {
      this.activePetId = petId
      this.updatePetVisualStates() // Update visual states when first pet becomes active
    }
    console.log(`✅ Pet entity ${petId} created (local only)`)
    return petData
  }

  /**
   * Gửi event mua pet lên server (buy_pet logic chuẩn backend)
   */
  /**
   * Gửi event mua pet lên server (chuẩn backend: create_pet với isBuyPet)
   * (Truyền x/y random để server có thể lưu vị trí spawn ban đầu nếu muốn)
   */
  buyPet(petType: string = "chog", petTypeId: string) {
    if (this.colyseusClient?.isConnected()) {
      // Random vị trí spawn cho pet mới
      const minX = 100,
        maxX = 700
      const minY = 200,
        maxY = 500
      const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX
      const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY
      this.colyseusClient.sendMessage("buy_pet", {
        petType,
        petTypeId,
        isBuyPet: true,
        x,
        y,
      })
    }
  }

  // Xóa pet
  removePet(petId: string): boolean {
    const petData = this.pets.get(petId)
    if (!petData) return false

    // Notify server about pet removal if connected
    if (this.colyseusClient?.isConnected()) {
      console.log(`📤 Sending remove-pet message to server for ${petId}`)
      this.colyseusClient.sendMessage("remove_pet", {
        petId: petId,
      })
    }

    // Cleanup pet and systems
    petData.pet.destroy()
    petData.feedingSystem.destroy()
    petData.cleanlinessSystem.destroy()

    this.pets.delete(petId)

    // Update active pet if needed
    if (this.activePetId === petId) {
      const remainingPets = Array.from(this.pets.keys())
      this.activePetId = remainingPets.length > 0 ? remainingPets[0] : null
    }

    console.log(`🗑️ Pet ${petId} removed`)
    return true
  }

  // Get pet data
  getPet(petId: string): PetData | undefined {
    return this.pets.get(petId)
  }

  // Get active pet
  getActivePet(): PetData | undefined {
    return this.activePetId ? this.pets.get(this.activePetId) : undefined
  }

  // Set active pet
  setActivePet(petId: string): boolean {
    if (this.pets.has(petId)) {
      this.activePetId = petId
      console.log(`🎯 Active pet changed to: ${petId}`)

      // Update visual indicators for all pets
      this.updatePetVisualStates()

      return true
    }
    return false
  }

  // Handle pet click to switch active pet
  private handlePetClick(petId: string): void {
    const petData = this.pets.get(petId)
    if (petData) {
      const petSprite = petData.pet.sprite
      const heart = this.scene.add.image(petSprite.x, petSprite.y - 30, "heart")
      heart.setScale(0.05)
      heart.setAlpha(0)
      heart.setDepth(1000)

      this.scene.tweens.add({
        targets: heart,
        y: heart.y - 20,
        alpha: 1,
        duration: 1000,
        ease: "Power2",
        yoyo: true,
        hold: 500,
        onComplete: () => heart.destroy(),
      })

      const gameScene = this.scene as any
      const tokenUI = gameScene.gameUI.getTokenUI()
      const tokenIconPosition = tokenUI.getTokenIconPosition()

      for (let i = 0; i < 5; i++) {
        const coin = this.scene.add.image(petSprite.x, petSprite.y, "coin")
        coin.setScale(0.05)
        coin.setDepth(1000)

        this.scene.tweens.add({
          targets: coin,
          x: coin.x + Phaser.Math.Between(-60, 60),
          y: petData.pet.groundY + 5,
          duration: 600,
          ease: "Bounce.easeOut",
          hold: 800,
          onComplete: () => {
            this.scene.tweens.add({
              targets: coin,
              x: tokenIconPosition.x,
              y: tokenIconPosition.y,
              duration: 500,
              ease: "Power2.easeIn",
              onComplete: () => {
                coin.destroy()
                // Increase user's token balance
                store.dispatch(addToken(1))
                // Update the token UI
                tokenUI.update()
              },
            })
          },
        })
      }
    }
  }

  // Update visual states for all pets (highlight active pet)
  public updatePetVisualStates(): void {
    for (const [petId, petData] of this.pets) {
      if (petId === this.activePetId) {
        // Highlight active pet with a subtle glow
        petData.pet.sprite.setTint(0xffff99) // Light yellow tint
      } else {
        // Remove highlight from inactive pets
        petData.pet.sprite.clearTint()
      }
    }
  }

  // Get all pets
  getAllPets(): PetData[] {
    return Array.from(this.pets.values())
  }

  // Get pet data by ID (for server sync)
  getPetData(petId: string): PetData | undefined {
    return this.pets.get(petId)
  }

  // Get all pets data
  getAllPetsData(): Map<string, PetData> {
    return this.pets
  }

  // Sync pet with server data
  syncPetWithServer(petId: string, serverPet: any): void {
    const petData = this.getPetData(petId)
    if (petData) {
      // Update position if significantly different
      const threshold = 5 // pixels
      if (
        Math.abs(petData.pet.sprite.x - serverPet.x) > threshold ||
        Math.abs(petData.pet.sprite.y - serverPet.y) > threshold
      ) {
        petData.pet.sprite.setPosition(serverPet.x, serverPet.y)
      }

      // Update other properties
      petData.pet.speed = serverPet.speed

      // Update hunger through feeding system
      if (petData.feedingSystem && typeof serverPet.hungerLevel === "number") {
        petData.feedingSystem.hungerLevel = serverPet.hungerLevel
      }

      petData.pet.setActivity(serverPet.currentActivity)

      if (serverPet.isChasing) {
        petData.pet.startChasing(serverPet.targetX, serverPet.targetY)
      } else {
        petData.pet.stopChasing()
      }

      console.log(`🔄 Pet ${petId} synced with server data`)
    }
  }

  // Add food from server
  addSharedFoodFromServer(foodId: string, serverFood: any): void {
    console.log("🍎 Adding shared food from server:", foodId, serverFood)

    // Create food sprite (using sprite instead of image for consistency)
    const foodSprite = this.scene.add.sprite(
      serverFood.x,
      serverFood.y,
      "hamburger"
    )
    foodSprite.setScale(GAME_LAYOUT.FOOD_SCALE)

    // Create shadow
    const shadow = this.scene.add.ellipse(
      serverFood.x,
      serverFood.y + 10,
      30,
      15,
      0x000000,
      0.3
    )

    // Create timer for food expiration (optional)
    const timer = this.scene.time.delayedCall(300000, () => {
      // 5 minutes
      this.removeSharedFoodByServerId(foodId)
    })

    // Add to shared food arrays with server ID metadata
    const foodWithId = foodSprite as any
    foodWithId.serverId = foodId
    foodWithId.droppedAt = serverFood.droppedAt || Date.now()

    this.sharedDroppedFood.push(foodSprite)
    this.sharedFoodShadows.push(shadow)
    this.sharedFoodTimers.push(timer)

    // Notify all pets about new food
    this.notifyPetsAboutFood()
  }

  // Remove food by server ID
  removeSharedFoodByServerId(serverId: string): void {
    const index = this.sharedDroppedFood.findIndex(
      (food: any) => food.serverId === serverId
    )

    if (index !== -1) {
      console.log("🗑️ Removing shared food by server ID:", serverId)

      // Get references
      const food = this.sharedDroppedFood[index]
      const shadow = this.sharedFoodShadows[index]
      const timer = this.sharedFoodTimers[index]

      // Handle pets that were targeting this food
      this.handleFoodRemovalForPets(food)

      // Clean up
      food.destroy()
      shadow.destroy()
      timer.destroy()

      // Remove from arrays
      this.sharedDroppedFood.splice(index, 1)
      this.sharedFoodShadows.splice(index, 1)
      this.sharedFoodTimers.splice(index, 1)
    }
  }

  // Handle food removal for pets that were targeting it
  private handleFoodRemovalForPets(
    removedFood: Phaser.GameObjects.Sprite
  ): void {
    for (const petData of this.pets.values()) {
      if (petData.pet.chaseTarget && petData.pet.chaseTarget === removedFood) {
        console.log(
          `🚶 Pet ${petData.id} target food removed, returning to walk`
        )
        petData.pet.stopChasing()
        petData.pet.isUserControlled = false
        petData.pet.setActivity("walk")
      }
    }

    // Remove from food targets map
    this.foodTargets.delete(removedFood)
  }

  // Update all pets
  update(): void {
    for (const petData of this.pets.values()) {
      const previousActivity = petData.pet.currentActivity
      const previousX = petData.pet.sprite.x
      const previousY = petData.pet.sprite.y

      // Update movement
      const movementResult = petData.movementSystem.update()

      // Always attempt to eat based on current position (even if not exactly at target)
      this.checkSharedFoodEating(
        petData,
        petData.pet.sprite.x,
        petData.pet.sprite.y
      )

      // Check ball interactions for pets that are chasing balls
      this.checkSharedBallPlaying(
        petData,
        petData.pet.sprite.x,
        petData.pet.sprite.y
      )

      // Update activity and feeding
      petData.activitySystem.update()
      petData.feedingSystem.update()
      petData.cleanlinessSystem.update()
      petData.happinessSystem.update()

      // Sync with server if activity or position changed significantly
      const currentActivity = petData.pet.currentActivity
      const currentX = petData.pet.sprite.x
      const currentY = petData.pet.sprite.y

      const positionChanged =
        Math.abs(currentX - previousX) > 5 || Math.abs(currentY - previousY) > 5
      const activityChanged = currentActivity !== previousActivity

      // Removed server sync for simplified version
      if (activityChanged || positionChanged) {
        console.log(`🔄 Pet ${petData.id} activity/position changed locally`)
      }
    }
  }

  // Shared feeding operations
  buyFood(foodId: string): boolean {
    // Use active pet's feeding system for purchase
    const activePet = this.getActivePet()
    if (activePet) {
      return activePet.feedingSystem.buyFood(foodId)
    }
    return false
  }

  // Combined buy and drop food operation - more reliable than separate calls
  buyAndDropFood(x: number, y?: number, foodId: string = "hamburger"): boolean {
    const activePet = this.getActivePet()
    if (!activePet) {
      console.log("❌ No active pet for buyAndDropFood")
      return false
    }

    // Check if we already have food in inventory
    if (activePet.feedingSystem.foodInventory > 0) {
      console.log("🍔 Using existing food from inventory")
      this.dropFood(x, y, foodId)
      return true
    } // Try to buy food first
    const purchased = this.buyFood(foodId)
    if (purchased) {
      console.log("🛒 Food purchased successfully, now dropping")

      // For both online and offline mode, ensure we can drop the food
      // In online mode, we trust the server response and allow immediate drop
      if (this.colyseusClient?.isConnected()) {
        // Online mode: temporarily increase inventory to allow drop
        // Server will sync the correct state later
        activePet.feedingSystem.foodInventory += 1
        this.dropFood(x, y, foodId)
      } else {
        // Offline mode: inventory is already updated by buyFood
        this.dropFood(x, y, foodId)
      }
      return true
    }

    console.log("❌ Failed to buy food for dropping")
    return false
  }

  // Combined buy and drop toy operation - similar to buyAndDropFood
  buyAndDropToy(x: number, y?: number, toyId: string = "ball"): boolean {
    const activePet = this.getActivePet()
    if (!activePet) {
      console.log("❌ No active pet for buyAndDropToy")
      return false
    }

    // Check if we already have toy in inventory
    if (activePet.happinessSystem.toyInventory > 0) {
      console.log("🎾 Using existing toy from inventory")
      this.dropToy(x, y, toyId)
      return true
    }

    // Try to buy toy first
    const purchased = this.buyToy(toyId)
    if (purchased) {
      console.log("🛒 Toy purchased successfully, now dropping")

      // For both online and offline mode, ensure we can drop the toy
      if (this.colyseusClient?.isConnected()) {
        // Online mode: temporarily increase inventory to allow drop
        // Server will sync the correct state later
        activePet.happinessSystem.toyInventory += 1
        this.dropToy(x, y, toyId)
      } else {
        // Offline mode: inventory is already updated by buyToy
        this.dropToy(x, y, toyId)
      }
      return true
    }

    console.log("❌ Failed to buy toy for dropping")
    return false
  }

  dropToy(x: number, y?: number, toyId: string = "ball"): void {
    const activePet = this.getActivePet()
    if (activePet && activePet.happinessSystem.toyInventory > 0) {
      // Deduct from active pet's inventory
      activePet.happinessSystem.toyInventory -= 1

      // Drop toy to shared pool instead of individual pet
      this.dropSharedToy(x, y, toyId)
    }
  }

  dropFood(x: number, y?: number, foodId: string = "hamburger"): void {
    const activePet = this.getActivePet()
    if (activePet && activePet.feedingSystem.foodInventory > 0) {
      // Deduct from active pet's inventory
      activePet.feedingSystem.foodInventory -= 1

      // Drop food to shared pool instead of individual pet
      this.dropSharedFood(x, y, foodId)
    }
  }

  // Drop food to shared pool that all pets can eat
  private dropSharedFood(
    x: number,
    _y?: number,
    foodId: string = "hamburger"
  ): void {
    // Food drops onto the same ground line pets stand on, to ensure reachability
    const cameraHeight = this.scene.cameras.main.height
    const cameraWidth = this.scene.cameras.main.width
    // Use food's own ground line to ensure it's visible and reachable
    const foodFinalY = GamePositioning.getFoodFinalY(cameraHeight)

    // Clamp food position to stay within pet boundaries (not food boundaries)
    // This ensures pets can always reach the food
    const petBounds = GamePositioning.getPetBoundaries(cameraWidth)
    const clampedX = Phaser.Math.Clamp(x, petBounds.minX, petBounds.maxX)

    // Get the correct texture key from food item
    const foodItem = gameConfigManager.getFoodItem(foodId)
    const textureKey = foodItem?.texture || foodId

    console.log(
      `🍔 Dropping food: requested x=${x}, clamped x=${clampedX}, pet bounds=[${petBounds.minX}, ${petBounds.maxX}], finalY=${foodFinalY}, foodId=${foodId}, textureKey=${textureKey}`
    )

    const foodDropStartY = GamePositioning.getFoodDropY(cameraHeight)
    const food = this.scene.add.image(clampedX, foodDropStartY, textureKey)
    food.setScale(GAME_LAYOUT.FOOD_SCALE)
    food.setAlpha(0.9)

    // Add drop animation effect
    this.scene.tweens.add({
      targets: food,
      y: foodFinalY,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: food,
          scaleX: 1.7,
          scaleY: 1.2,
          duration: 100,
          yoyo: true,
        })
      },
    })

    // Add shadow effect
    const shadow = this.scene.add.ellipse(
      clampedX,
      foodFinalY + 8,
      30,
      12,
      0x000000,
      0.3
    )
    this.scene.tweens.add({
      targets: shadow,
      scaleX: 1.3,
      alpha: 0.5,
      duration: 500,
      ease: "Power2.easeOut",
    })

    this.sharedDroppedFood.push(food as any)
    this.sharedFoodShadows.push(shadow)

    // Create timer to auto-despawn food after 20s
    const despawnTimer = this.scene.time.delayedCall(20000, () => {
      const currentFoodIndex = this.sharedDroppedFood.indexOf(food as any)
      if (currentFoodIndex !== -1) {
        this.removeSharedFoodAtIndex(currentFoodIndex)
        console.log("Shared food auto-despawned after 20 seconds")
      }
    })
    this.sharedFoodTimers.push(despawnTimer)

    // Notify all pets about new food
    this.notifyPetsAboutFood()

    console.log(`Dropped shared food at (${clampedX}, ${foodFinalY})`)
  }

  // Remove shared food at specific index
  private removeSharedFoodAtIndex(index: number): void {
    if (index < 0 || index >= this.sharedDroppedFood.length) return

    const food = this.sharedDroppedFood[index]
    const shadow = this.sharedFoodShadows[index]
    const timer = this.sharedFoodTimers[index]
    // If some pet was assigned to chase this food, reset it immediately to avoid stuck state
    const chasingPetId = this.foodTargets.get(food)
    if (chasingPetId) {
      const chasingPetData = this.pets.get(chasingPetId)
      if (chasingPetData) {
        chasingPetData.pet.stopChasing()
        this.forceReturnToWalk(chasingPetData)
      }
      this.foodTargets.delete(food)
    }

    // Cancel timer if it exists
    if (timer && !timer.hasDispatched) {
      timer.destroy()
    }

    // Animate food and shadow removal
    this.scene.tweens.add({
      targets: food,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      ease: "Power2.easeIn",
      onComplete: () => {
        food.destroy()
      },
    })

    this.scene.tweens.add({
      targets: shadow,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        shadow.destroy()
      },
    })

    // Remove from arrays
    this.sharedDroppedFood.splice(index, 1)
    this.sharedFoodShadows.splice(index, 1)
    this.sharedFoodTimers.splice(index, 1)

    // No additional handling needed; the assigned pet (if any) was already forced back to walk

    console.log("Shared food removed at index:", index)
  }

  // Remove shared ball at specific index
  private removeSharedBallAtIndex(index: number): void {
    if (index < 0 || index >= this.sharedDroppedBalls.length) return

    const ball = this.sharedDroppedBalls[index]
    const shadow = this.sharedBallShadows[index]
    const timer = this.sharedBallTimers[index]

    // Check if any pet was chasing this specific ball
    const chasingPetId = this.ballTargets.get(ball)
    let wasBeingChased = false
    let chasingPetData: PetData | undefined

    if (chasingPetId) {
      chasingPetData = this.pets.get(chasingPetId)
      if (
        chasingPetData &&
        chasingPetData.pet.isChasing &&
        chasingPetData.pet.chaseTarget
      ) {
        const distance = Phaser.Math.Distance.Between(
          chasingPetData.pet.chaseTarget.x,
          chasingPetData.pet.chaseTarget.y,
          ball.x,
          ball.y
        )
        wasBeingChased = distance < 10
      }
    }

    // Remove from ball targets tracking
    this.ballTargets.delete(ball)

    // Destroy game objects
    ball.destroy()
    timer?.destroy()

    // Fade out shadow
    this.scene.tweens.add({
      targets: shadow,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        shadow.destroy()
      },
    })

    // Remove from arrays
    this.sharedDroppedBalls.splice(index, 1)
    this.sharedBallShadows.splice(index, 1)
    this.sharedBallTimers.splice(index, 1)

    // Handle pet that was chasing this ball
    if (wasBeingChased && chasingPetData) {
      console.log(
        `🎾 Pet ${chasingPetData.id} was chasing ball that disappeared, handling gracefully`
      )

      // Stop chasing immediately and trigger the play action
      chasingPetData.pet.stopChasing()
      chasingPetData.happinessSystem.triggerPlay(
        GAME_MECHANICS.HAPPINESS_INCREASE_AMOUNT
      )

      // Quick transition to avoid stuttering
      this.scene.time.delayedCall(30, () => {
        if (
          chasingPetData.happinessSystem.happinessLevel < 100 &&
          this.sharedDroppedBalls.length > 0
        ) {
          console.log(
            `🔄 Pet ${chasingPetData.id} looking for another ball after playing`
          )
          this.checkPetShouldChaseBalls(chasingPetData)
        } else {
          console.log(
            `🚶 Pet ${chasingPetData.id} returning to walk mode after playing`
          )
          chasingPetData.pet.isUserControlled = false
          chasingPetData.pet.setActivity("walk")
        }
      })
    }

    console.log("Shared ball removed at index:", index)
  }

  // Drop shared toy for all pets to chase
  private dropSharedToy(x: number, _y?: number, toyId: string = "ball"): void {
    // Check if scene is ready and assets are loaded
    if (!this.scene.textures || this.scene.textures.list.length === 0) {
      console.error("❌ Scene textures not ready yet!")
      return
    }
    const cameraHeight = this.scene.cameras.main.height
    const cameraWidth = this.scene.cameras.main.width
    const toyFinalY = GamePositioning.getFoodFinalY(cameraHeight) // Use same Y as food

    // Clamp toy position to pet boundaries
    const petBounds = GamePositioning.getPetBoundaries(cameraWidth)
    const clampedX = Phaser.Math.Clamp(x, petBounds.minX, petBounds.maxX)

    // Get the correct texture key from toy item
    const toyItem = gameConfigManager.getToyItem(toyId)

    // If we have a toy item from config, use its texture
    let textureKey = toyId // fallback to toyId
    if (toyItem && toyItem.texture) {
      textureKey = toyItem.texture
    } else {
      // Hardcode texture mapping for known toys (fallback)
      const textureMap: { [key: string]: string } = {
        ball: "ball",
        daruma: "daruma",
        teddy: "tedy",
        tedy: "tedy",
        football: "football",
        game: "game",
      }
      textureKey = textureMap[toyId] || toyId
    }

    console.log(
      `🎾 Dropping toy: requested x=${x}, clamped x=${clampedX}, pet bounds=[${petBounds.minX}, ${petBounds.maxX}], finalY=${toyFinalY}, toyId=${toyId}, textureKey=${textureKey}`
    )
    console.log(`🔍 Debug: toyId from shop=`, toyId)
    console.log(`🔍 Debug: toyItem=`, toyItem)
    console.log(`🔍 Debug: toyItem.texture=`, toyItem?.texture)
    console.log(`🔍 Debug: final textureKey=`, textureKey)
    console.log(
      `🔍 Debug: Available textures:`,
      Object.keys(this.scene.textures.list)
    )
    console.log(`🔍 Debug: Looking for texture: '${textureKey}'`)
    console.log(
      `🔍 Debug: Texture exists:`,
      this.scene.textures.exists(textureKey)
    )

    // Check if texture exists before creating sprite
    if (!this.scene.textures.exists(textureKey)) {
      console.error(
        `❌ Texture '${textureKey}' not found! Available textures:`,
        Object.keys(this.scene.textures.list)
      )
      // Fallback to ball texture if available
      const fallbackKey = this.scene.textures.exists("ball") ? "ball" : "coin"
      console.log(`🔄 Using fallback texture: ${fallbackKey}`)
      const toy = this.scene.add.sprite(
        clampedX,
        GamePositioning.getFoodDropY(cameraHeight),
        fallbackKey
      )
      toy.setScale(0.5)
      toy.setAlpha(0.9)
      this.sharedDroppedBalls.push(toy)
      this.sharedBallShadows.push(
        this.scene.add.ellipse(clampedX, toyFinalY + 15, 20, 8, 0x000000, 0.3)
      )
      return
    }

    const toy = this.scene.add.sprite(
      clampedX,
      GamePositioning.getFoodDropY(cameraHeight),
      textureKey
    )
    toy.setScale(0.75) // Increased scale for better visibility
    toy.setAlpha(0.9)

    console.log(`🎾 Sprite created:`, toy)
    console.log(`🎾 Sprite visible:`, toy.visible)
    console.log(`🎾 Sprite texture:`, toy.texture?.key)
    console.log(`🎾 Sprite position:`, { x: toy.x, y: toy.y })
    console.log(`🎾 Sprite scale:`, { scaleX: toy.scaleX, scaleY: toy.scaleY })

    // Add drop animation effect
    this.scene.tweens.add({
      targets: toy,
      y: toyFinalY,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: toy,
          scaleX: 0.5 * 1.13,
          scaleY: 0.5 * 0.8,
          duration: 100,
          yoyo: true,
        })
      },
    })

    // Add shadow effect
    const shadow = this.scene.add.ellipse(
      clampedX,
      toyFinalY + 15,
      20,
      8,
      0x000000,
      0.3
    )
    this.scene.tweens.add({
      targets: shadow,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      ease: "Power2",
    })

    this.sharedDroppedBalls.push(toy)
    this.sharedBallShadows.push(shadow)

    console.log(
      `🎾 Added to sharedDroppedBalls. Total balls:`,
      this.sharedDroppedBalls.length
    )
    console.log(`🎾 sharedDroppedBalls array:`, this.sharedDroppedBalls)

    // Create timer to auto-despawn toy after 30s
    const despawnTimer = this.scene.time.delayedCall(
      GAME_MECHANICS.BALL_LIFETIME,
      () => {
        const currentBallIndex = this.sharedDroppedBalls.indexOf(toy)
        if (currentBallIndex !== -1) {
          this.removeSharedBallAtIndex(currentBallIndex)
          console.log("Shared toy auto-despawned after 30 seconds")
        }
      }
    )
    this.sharedBallTimers.push(despawnTimer)

    // Notify all pets about new toy
    this.notifyPetsAboutBalls()

    console.log(`Dropped shared toy at (${clampedX}, ${toyFinalY})`)
  }

  // Drop shared ball for all pets to chase
  private dropSharedBall(x: number, _y?: number): void {
    const cameraHeight = this.scene.cameras.main.height
    const cameraWidth = this.scene.cameras.main.width
    const ballFinalY = GamePositioning.getFoodFinalY(cameraHeight) // Use same Y as food

    // Clamp ball position to pet boundaries
    const petBounds = GamePositioning.getPetBoundaries(cameraWidth)
    const clampedX = Phaser.Math.Clamp(x, petBounds.minX, petBounds.maxX)

    console.log(
      `🎾 Dropping ball: requested x=${x}, clamped x=${clampedX}, pet bounds=[${petBounds.minX}, ${petBounds.maxX}], finalY=${ballFinalY}`
    )

    const ball = this.scene.add.sprite(
      clampedX,
      GamePositioning.getFoodDropY(cameraHeight),
      "ball"
    )
    ball.setScale(GAME_LAYOUT.BALL_SCALE)
    ball.setAlpha(0.9)

    // Add drop animation effect
    this.scene.tweens.add({
      targets: ball,
      y: ballFinalY,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: ball,
          scaleX: GAME_LAYOUT.BALL_SCALE * 1.13,
          scaleY: GAME_LAYOUT.BALL_SCALE * 0.8,
          duration: 100,
          yoyo: true,
        })
      },
    })

    // Add shadow effect
    const shadow = this.scene.add.ellipse(
      clampedX,
      ballFinalY + 15,
      20,
      8,
      0x000000,
      0.3
    )
    this.scene.tweens.add({
      targets: shadow,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      ease: "Power2",
    })

    this.sharedDroppedBalls.push(ball)
    this.sharedBallShadows.push(shadow)

    // Create timer to auto-despawn ball after 30s
    const despawnTimer = this.scene.time.delayedCall(
      GAME_MECHANICS.BALL_LIFETIME,
      () => {
        const currentBallIndex = this.sharedDroppedBalls.indexOf(ball)
        if (currentBallIndex !== -1) {
          this.removeSharedBallAtIndex(currentBallIndex)
          console.log("Shared ball auto-despawned after 30 seconds")
        }
      }
    )
    this.sharedBallTimers.push(despawnTimer)

    // Notify all pets about new ball
    this.notifyPetsAboutBalls()

    console.log(`Dropped shared ball at (${clampedX}, ${ballFinalY})`)
  }

  // Notify all pets about new food available
  private notifyPetsAboutFood(): void {
    for (const petData of this.pets.values()) {
      // Check if pet should start chasing the new food
      this.checkPetShouldChaseSharedFood(petData)
    }
  }

  // Notify all pets about new balls available
  private notifyPetsAboutBalls(): void {
    for (const petData of this.pets.values()) {
      // Check if pet should start chasing the new ball
      this.checkPetShouldChaseBalls(petData)
    }
  }

  // Check if a specific pet should chase shared food
  private checkPetShouldChaseSharedFood(petData: PetData): void {
    if (this.sharedDroppedFood.length === 0) return
    if (petData.pet.isChasing || petData.pet.currentActivity === "chew") return

    // Check hunger level using the same logic as FeedingSystem
    const hungerLevel = petData.feedingSystem.hungerLevel
    const isHungry = hungerLevel < GAME_MECHANICS.HUNGER_THRESHOLD // Hungry or Starving

    console.log(
      `🔍 Checking chase for Pet ${petData.id}: hunger=${hungerLevel}%, hungry=${isHungry}`
    )

    if (isHungry) {
      // Find food that is not being chased by another pet
      const availableFood = this.sharedDroppedFood.filter(
        (food) => !this.foodTargets.has(food)
      )

      console.log(
        `🍔 Available food count: ${availableFood.length}/${this.sharedDroppedFood.length}`
      )

      if (availableFood.length > 0) {
        // Find closest available food instead of random (more natural behavior)
        let closestFood: Phaser.GameObjects.Sprite | null = null
        let closestDistance = Infinity

        for (const food of availableFood) {
          const distance = Phaser.Math.Distance.Between(
            petData.pet.sprite.x,
            petData.pet.sprite.y,
            food.x,
            food.y
          )
          if (distance < closestDistance) {
            closestDistance = distance
            closestFood = food
          }
        }

        if (closestFood) {
          // Mark this food as being chased by this pet
          this.foodTargets.set(closestFood, petData.id)

          petData.pet.startChasing(closestFood.x, closestFood.y)

          // Removed server sync for simplified version
          console.log(`🏃 Pet ${petData.id} started chasing food locally`)

          console.log(
            `🏃 Pet ${petData.id} started chasing closest shared food at (${
              closestFood.x
            }, ${closestFood.y}), distance: ${closestDistance.toFixed(1)}`
          )
        }
      } else {
        console.log(
          `⚠️ Pet ${petData.id} wants to chase food but all food is being chased`
        )
      }
    }
  }

  // Check if a specific pet should chase shared balls
  private checkPetShouldChaseBalls(petData: PetData): void {
    if (this.sharedDroppedBalls.length === 0) return
    if (petData.pet.isChasing || petData.pet.currentActivity === "chew") return

    // Check happiness level - pets chase balls when happiness is low
    const happinessLevel = petData.happinessSystem.happinessLevel
    const needsHappiness = happinessLevel < 80 // Need happiness boost

    console.log(
      `🔍 Checking ball chase for Pet ${petData.id}: happiness=${happinessLevel}%, needs happiness=${needsHappiness}`
    )

    if (needsHappiness) {
      // Find ball that is not being chased by another pet
      const availableBalls = this.sharedDroppedBalls.filter(
        (ball) => !this.ballTargets.has(ball)
      )

      console.log(
        `🎾 Available balls count: ${availableBalls.length}/${this.sharedDroppedBalls.length}`
      )

      if (availableBalls.length > 0) {
        // Find closest available ball
        let closestBall: Phaser.GameObjects.Sprite | null = null
        let closestDistance = Infinity

        for (const ball of availableBalls) {
          const distance = Phaser.Math.Distance.Between(
            petData.pet.sprite.x,
            petData.pet.sprite.y,
            ball.x,
            ball.y
          )
          if (distance < closestDistance) {
            closestDistance = distance
            closestBall = ball
          }
        }

        if (closestBall) {
          // Mark this ball as being chased by this pet
          this.ballTargets.set(closestBall, petData.id)

          petData.pet.startChasing(closestBall.x, closestBall.y)

          console.log(`🏃 Pet ${petData.id} started chasing ball locally`)

          console.log(
            `🏃 Pet ${petData.id} started chasing closest shared ball at (${
              closestBall.x
            }, ${closestBall.y}), distance: ${closestDistance.toFixed(1)}`
          )
        }
      } else {
        console.log(
          `⚠️ Pet ${petData.id} wants to chase ball but all balls are being chased`
        )
      }
    }
  }

  // Check if pet can eat shared food
  checkSharedFoodEating(petData: PetData, x: number, y: number): boolean {
    // Prefer detecting by pet's actual position to avoid target mismatch
    const petX = petData.pet.sprite.x
    const petY = petData.pet.sprite.y
    const EAT_RADIUS = 35 // closer contact distance
    const MAX_Y_DELTA = 25 // tighter vertical tolerance

    let foodIndex = this.sharedDroppedFood.findIndex((food) => {
      const dx = Math.abs(food.x - petX)
      const dy = Math.abs(food.y - petY)
      const dist = Phaser.Math.Distance.Between(food.x, food.y, petX, petY)
      return dist < EAT_RADIUS || (dx < 20 && dy < MAX_Y_DELTA)
    })

    // Fallback: check near the movement target if not found near pet
    if (foodIndex === -1) {
      foodIndex = this.sharedDroppedFood.findIndex((food) => {
        const dx = Math.abs(food.x - x)
        const dy = Math.abs(food.y - y)
        const dist = Phaser.Math.Distance.Between(food.x, food.y, x, y)
        return dist < EAT_RADIUS || (dx < 20 && dy < MAX_Y_DELTA)
      })
    }

    if (foodIndex !== -1) {
      console.log(`🍔 Pet ${petData.id} reached food at index ${foodIndex}`)

      // Release food target for this pet immediately
      this.releaseFoodTarget(petData.id)

      // Stop chasing immediately to avoid sliding
      petData.pet.stopChasing()

      // Remove food immediately and then trigger chewing shortly after
      const foodObj = this.sharedDroppedFood[foodIndex]
      const idx = this.sharedDroppedFood.indexOf(foodObj)
      if (idx !== -1) {
        this.removeSharedFoodAtIndex(idx)
      }
      // Start chew shortly after to ensure a visible transition
      this.scene.time.delayedCall(100, () => {
        petData.feedingSystem.triggerEat("hamburger")
        this.handlePetPostEating(petData)
      })

      return true
    }

    return false
  }

  // Check if pet can play with shared ball
  checkSharedBallPlaying(petData: PetData, x: number, y: number): boolean {
    // Find and remove ball from shared pool
    const ballIndex = this.sharedDroppedBalls.findIndex(
      (ball) => Phaser.Math.Distance.Between(ball.x, ball.y, x, y) < 40
    )

    if (ballIndex !== -1) {
      console.log(
        `🎾 Pet ${petData.id} is playing with ball at index ${ballIndex}`
      )

      // Release ball target for this pet
      this.releaseBallTarget(petData.id)

      // Remove ball from shared pool
      this.removeSharedBallAtIndex(ballIndex)

      // Stop chasing and trigger the playing process via the happiness system
      petData.pet.stopChasing()
      petData.happinessSystem.triggerPlay(
        GAME_MECHANICS.HAPPINESS_INCREASE_AMOUNT
      )

      // Handle post-playing behavior
      this.handlePetPostPlaying(petData)

      return true
    }

    return false
  }

  // Handle pet behavior after eating
  private handlePetPostEating(petData: PetData): void {
    console.log(
      `🍽️ Pet ${petData.id} started eating, will check for next action in 3 seconds`
    )

    // Force ensure pet is in correct state
    petData.pet.isUserControlled = true // Temporarily user controlled while eating

    // Use fixed timer instead of animation event for reliability
    this.scene.time.delayedCall(3000, () => {
      // Force check and reset pet state regardless of current activity
      if (
        petData.pet.currentActivity === "chew" ||
        petData.pet.isUserControlled
      ) {
        // Check if pet should continue chasing more food or return to auto walk
        if (
          petData.feedingSystem.hungerLevel < 100 &&
          this.sharedDroppedFood.length > 0
        ) {
          // Reset state before checking for more food
          petData.pet.isUserControlled = false
          petData.pet.isChasing = false
          petData.pet.chaseTarget = null

          // Use forceStartChasing for more reliable food targeting
          this.forceStartChasing(petData)
        } else {
          // Force return to auto walk mode
          this.forceReturnToWalk(petData)
        }
      } else {
        this.forceReturnToWalk(petData)
      }
    })
  }

  // Force pet to return to walk mode (safety method)
  private forceReturnToWalk(petData: PetData): void {
    // Release any food target this pet was chasing
    this.releaseFoodTarget(petData.id)

    // Reset all states completely
    petData.pet.isUserControlled = false
    petData.pet.isChasing = false
    petData.pet.chaseTarget = null

    // Reset lastEdgeHit to allow proper boundary detection
    petData.pet.lastEdgeHit = ""

    // Force activity to walk and ensure pet starts moving automatically
    petData.pet.setActivity("walk")

    // Double-check: if pet is still not moving automatically after a brief delay
    this.scene.time.delayedCall(500, () => {
      if (
        petData.pet.isUserControlled ||
        petData.pet.currentActivity !== "walk"
      ) {
        petData.pet.isUserControlled = false
        petData.pet.isChasing = false
        petData.pet.chaseTarget = null
        petData.pet.lastEdgeHit = "" // Reset edge detection again
        petData.pet.setActivity("walk")
      }
    })

    console.log(`✅ Pet ${petData.id} forced back to walk mode`)
  }

  // Get shared food inventory (from active pet)
  getFoodInventory(): number {
    const activePet = this.getActivePet()
    return activePet?.feedingSystem.foodInventory || 0
  }

  // Cleaning management methods
  buyCleaning(cleaningId: string): boolean {
    const activePet = this.getActivePet()
    if (activePet) {
      return activePet.cleanlinessSystem.buyCleaning(cleaningId)
    }
    return false
  }

  useCleaning(): boolean {
    const activePet = this.getActivePet()
    if (activePet) {
      return activePet.cleanlinessSystem.useCleaning()
    }
    return false
  }

  getCleaningInventory(): number {
    const activePet = this.getActivePet()
    return activePet?.cleanlinessSystem.cleaningInventory || 0
  }

  // Happiness/Toy management methods
  buyToy(toyId: string): boolean {
    const activePet = this.getActivePet()
    if (activePet) {
      return activePet.happinessSystem.buyToy(toyId)
    }
    return false
  }

  useBall(x: number, y: number): boolean {
    const activePet = this.getActivePet()
    if (activePet && activePet.happinessSystem.toyInventory > 0) {
      activePet.happinessSystem.toyInventory--
      this.dropSharedToy(x, y, "ball")
      return true
    } else {
      // TODO: Implement buying logic to buy without ID?
      const success = this.buyToy("ball")
      if (success) {
        this.dropSharedToy(x, y, "ball")
        return true
      }
    }
    return false
  }

  getToyInventory(): number {
    const activePet = this.getActivePet()
    return activePet?.happinessSystem.toyInventory || 0
  }

  // Get stats for UI
  getPetStats() {
    const stats = this.getAllPets().map((petData) => ({
      id: petData.id,
      isActive: petData.id === this.activePetId,
      hungerLevel: petData.feedingSystem.hungerLevel,
      cleanlinessLevel: petData.cleanlinessSystem.cleanlinessLevel,
      happinessLevel: petData.happinessSystem.happinessLevel,
      currentActivity: petData.pet.currentActivity,
      foodInventory: petData.feedingSystem.foodInventory,
    }))

    return {
      activePetId: this.activePetId,
      totalPets: this.pets.size,
      pets: stats,
      totalFoodInventory: this.getFoodInventory(),
      totalCleaningInventory: this.getCleaningInventory(),
      totalToyInventory: this.getToyInventory(),
    }
  }
  // Cleanup all pets
  cleanup(): void {
    // Stop safety timer
    if (this.safetyTimer) {
      this.safetyTimer.destroy()
      this.safetyTimer = undefined
    }

    for (const petData of this.pets.values()) {
      petData.pet.destroy()
      petData.feedingSystem.destroy()
      petData.cleanlinessSystem.destroy()
      petData.happinessSystem.destroy()
    }
    this.pets.clear()
    this.activePetId = null

    // Cleanup shared food
    while (this.sharedDroppedFood.length > 0) {
      this.removeSharedFoodAtIndex(0)
    }

    // Clear food targets
    this.foodTargets.clear()
  }

  // Release food target when pet stops chasing
  private releaseFoodTarget(petId: string): void {
    for (const [food, chasingPetId] of this.foodTargets.entries()) {
      if (chasingPetId === petId) {
        this.foodTargets.delete(food)
        console.log(`Pet ${petId} released food target`)
        break
      }
    }
  }

  // Start safety check timer
  private startSafetyCheck(): void {
    this.safetyTimer = this.scene.time.addEvent({
      delay: 5000, // 5 seconds
      callback: () => {
        this.performSafetyCheck()
      },
      loop: true,
    })
  }

  // Perform safety check on all pets
  private performSafetyCheck(): void {
    console.log("🔍 Performing safety check on all pets...")

    for (const petData of this.pets.values()) {
      // Check if pet has been chewing for too long
      if (petData.pet.currentActivity === "chew" && !petData.pet.isChasing) {
        console.log(
          `⚠️ SAFETY: Pet ${petData.id} stuck in chew mode, forcing to walk`
        )
        this.forceReturnToWalk(petData)
      }

      // Check if pet is user controlled but not chasing anything
      if (
        petData.pet.isUserControlled &&
        !petData.pet.isChasing &&
        !petData.pet.chaseTarget
      ) {
        console.log(
          `⚠️ SAFETY: Pet ${petData.id} user controlled but not chasing, releasing control`
        )
        petData.pet.isUserControlled = false
        petData.pet.setActivity("walk")
      }

      // Check if pet has invalid chase target
      if (petData.pet.isChasing && !petData.pet.chaseTarget) {
        petData.pet.isChasing = false
        petData.pet.isUserControlled = false
        petData.pet.setActivity("walk")
      }
    }
  }

  // Force reset all pets to walking state (emergency method)
  forceResetAllPets(): void {
    for (const petData of this.pets.values()) {
      this.forceReturnToWalk(petData)
    }

    // Clear all food targets
    this.foodTargets.clear()
  }

  // Debug method to check all pets status
  debugPetsStatus(): void {
    console.log("=== PETS STATUS DEBUG ===")
    const cameraWidth = this.scene.cameras.main.width
    const cameraHeight = this.scene.cameras.main.height
    const petBounds = GamePositioning.getPetBoundaries(cameraWidth)
    const correctGroundY = GamePositioning.getPetY(cameraHeight)

    console.log(`Camera: ${cameraWidth}x${cameraHeight}`)
    console.log(`Pet Boundaries: [${petBounds.minX}, ${petBounds.maxX}]`)
    console.log(`Correct Ground Y: ${correctGroundY}`)

    for (const petData of this.pets.values()) {
      console.log(`Pet ${petData.id}:`)
      console.log(
        `  Position: (${petData.pet.sprite.x.toFixed(
          1
        )}, ${petData.pet.sprite.y.toFixed(1)})`
      )
      console.log(`  Stored Ground Y: ${petData.pet.groundY}`)
      console.log(`  Activity: ${petData.pet.currentActivity}`)
      console.log(`  Is Chasing: ${petData.pet.isChasing}`)
      console.log(`  Is User Controlled: ${petData.pet.isUserControlled}`)
      console.log(`  Direction: ${petData.pet.direction}`)
      console.log(`  Hunger: ${petData.feedingSystem.hungerLevel}%`)
      console.log(
        `  In Bounds: ${
          petData.pet.sprite.x >= petBounds.minX &&
          petData.pet.sprite.x <= petBounds.maxX
        }`
      )
      console.log(
        `  Chase Target: ${
          petData.pet.chaseTarget
            ? `(${petData.pet.chaseTarget.x}, ${petData.pet.chaseTarget.y})`
            : "None"
        }`
      )
    }
    console.log(`Food Targets: ${this.foodTargets.size}`)
    console.log(`Shared Food: ${this.sharedDroppedFood.length}`)
    console.log("=== END DEBUG ===")
  }

  // Force pet to start chasing (similar to FeedingSystem.forceStartChasing)
  private forceStartChasing(petData: PetData): void {
    // Check hunger level first
    const hungerLevel = petData.feedingSystem.hungerLevel
    const isHungry = hungerLevel < 80

    if (!isHungry || this.sharedDroppedFood.length === 0) {
      // If no more food or pet is full, return to walk mode
      petData.pet.isUserControlled = false
      petData.pet.setActivity("walk")
      console.log(
        `🚶 Pet ${petData.id} not hungry or no food, returning to walk mode`
      )
      return
    }

    // If pet is currently chasing, don't interrupt
    if (petData.pet.isChasing) {
      console.log(`⚠️ Pet ${petData.id} already chasing, not forcing new chase`)
      return
    }

    // Find available food (not being chased by others)
    const availableFood = this.sharedDroppedFood.filter(
      (food) => !this.foodTargets.has(food)
    )

    if (availableFood.length > 0) {
      // Pick closest available food
      let closestFood: Phaser.GameObjects.Sprite | null = null
      let closestDistance = Infinity

      for (const food of availableFood) {
        const distance = Phaser.Math.Distance.Between(
          petData.pet.sprite.x,
          petData.pet.sprite.y,
          food.x,
          food.y
        )
        if (distance < closestDistance) {
          closestDistance = distance
          closestFood = food
        }
      }

      if (closestFood) {
        this.foodTargets.set(closestFood, petData.id)
        petData.pet.startChasing(closestFood.x, closestFood.y)
        console.log(
          `🚀 Pet ${petData.id} force started chasing food at (${closestFood.x}, ${closestFood.y})`
        )
      }
    } else {
      // No available food, return to walk mode
      petData.pet.isUserControlled = false
      petData.pet.setActivity("walk")
      console.log(
        `😔 Pet ${petData.id} no available food, returning to walk mode`
      )
    }
  }

  // Force pet to start chasing a ball
  private forceStartChasingBall(petData: PetData): void {
    const happinessLevel = petData.happinessSystem.happinessLevel
    const needsHappiness = happinessLevel < 80

    if (!needsHappiness || this.sharedDroppedBalls.length === 0) {
      this.forceReturnToWalk(petData)
      console.log(
        `🚶 Pet ${petData.id} is happy or no balls, returning to walk mode`
      )
      return
    }

    if (petData.pet.isChasing) {
      console.log(
        `⚠️ Pet ${petData.id} already chasing, not forcing new ball chase`
      )
      return
    }

    const availableBalls = this.sharedDroppedBalls.filter(
      (ball) => !this.ballTargets.has(ball)
    )

    if (availableBalls.length > 0) {
      let closestBall: Phaser.GameObjects.Sprite | null = null
      let closestDistance = Infinity

      for (const ball of availableBalls) {
        const distance = Phaser.Math.Distance.Between(
          petData.pet.sprite.x,
          petData.pet.sprite.y,
          ball.x,
          ball.y
        )
        if (distance < closestDistance) {
          closestDistance = distance
          closestBall = ball
        }
      }

      if (closestBall) {
        this.ballTargets.set(closestBall, petData.id)
        petData.pet.startChasing(closestBall.x, closestBall.y)
        console.log(
          `🚀 Pet ${petData.id} force started chasing ball at (${closestBall.x}, ${closestBall.y})`
        )
      }
    } else {
      this.forceReturnToWalk(petData)
      console.log(
        `😔 Pet ${petData.id} no available balls, returning to walk mode`
      )
    }
  }

  private releaseBallTarget(petId: string): void {
    for (const [ball, chasingPetId] of this.ballTargets.entries()) {
      if (chasingPetId === petId) {
        this.ballTargets.delete(ball)
        console.log(`Pet ${petId} released ball target`)
        break
      }
    }
  }

  private handlePetPostPlaying(petData: PetData): void {
    console.log(
      `⚽ Pet ${petData.id} finished playing, will check for next action in 2 seconds`
    )
    console.log(`🔍 Debug: Pet state before post-playing:`, {
      isUserControlled: petData.pet.isUserControlled,
      isChasing: petData.pet.isChasing,
      currentActivity: petData.pet.currentActivity,
      chaseTarget: petData.pet.chaseTarget,
    })

    // Use a fixed timer for reliability, similar to post-eating logic
    this.scene.time.delayedCall(2000, () => {
      console.log(`🔍 Debug: Pet state after 2s delay:`, {
        isUserControlled: petData.pet.isUserControlled,
        isChasing: petData.pet.isChasing,
        currentActivity: petData.pet.currentActivity,
        sharedBallsCount: this.sharedDroppedBalls.length,
      })

      // Check if the pet should continue chasing more balls or return to auto walk
      if (this.sharedDroppedBalls.length > 0) {
        // Reset state before checking for more balls, mirroring the post-eating flow
        petData.pet.isUserControlled = false
        petData.pet.isChasing = false
        petData.pet.chaseTarget = null

        // Use forceStartChasingBall for reliable targeting
        this.forceStartChasingBall(petData)
      } else {
        // No more balls, force return to auto walk mode
        this.forceReturnToWalk(petData)
      }
    })
  }

  // Handle right-click on pet to show pet details modal
  handlePetRightClick(petId: string): void {
    const petData = this.pets.get(petId)
    if (!petData) {
      console.warn(`⚠️ Pet ${petId} not found for right-click`)
      return
    }

    console.log(`🖱️ Right-clicked on pet ${petId}, showing details modal`)

    // Get GameUI reference to show modal
    const gameScene = this.scene as any
    if (gameScene.gameUI && gameScene.gameUI.petDetailsModal) {
      gameScene.gameUI.petDetailsModal.showForPet(petData)
    } else {
      console.warn("⚠️ GameUI or PetDetailsModal not found")
    }
  }
}
