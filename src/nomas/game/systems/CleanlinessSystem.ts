import { Pet } from "../entities/Pet"
import { GAME_MECHANICS } from "@/nomas/game/constants/gameConstants"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import type { ColyseusClient } from "@/nomas/game/colyseus/client"
import { spendToken, store } from "@/nomas/redux"

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
    }

    // ===== UPDATE LOOP =====

    update() {
        this.updateCleanliness()
        this.checkPoopOpportunity()
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

    private checkPoopOpportunity() {
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
                console.log("💩 Pet needs to poop, cleanliness:", this.cleanlinessLevel)
                this.dropPoop()
                this.lastPoopCheck = now
                this.lastPoopTime = now // Update last poop time

                // Force exit the poop check to prevent immediate re-trigger
                return
            }
        }
    }

    // ===== POOP MANAGEMENT =====

    private dropPoop() {
        const petX = this.pet.sprite.x
        const petY = this.pet.sprite.y

        // Create animated poop sprite
        console.log(
            "💩 Creating poop sprite at:",
            petX,
            petY - 5,
            "cleanliness:",
            this.cleanlinessLevel
        )
        const poop = this.scene.add.sprite(petX, petY - 5, "poop")
        poop.setScale(0.3) // Use larger scale for visibility
        poop.setAlpha(0.9)

        // Play poop animation
        console.log("🎬 Playing poop animation...")
        try {
            poop.play("poop-animation")
        } catch (error) {
            console.warn(
                "⚠️ Failed to play poop animation, using first frame:",
                error
            )
            // Fallback: use the first frame of the atlas
            poop.setFrame("broom #Shit 0.aseprite")
        }

        // Create shadow
        const shadow = this.scene.add.ellipse(petX, petY + 5, 20, 10, 0x000000, 0.3)

        // Add animation effect
        this.scene.tweens.add({
            targets: poop,
            scaleX: 0.2,
            scaleY: 0.3,
            duration: 200,
            yoyo: true,
        })

        this.poopObjects.push(poop)
        this.poopShadows.push(shadow)

        // No auto-despawn - poop only disappears when cleaned up
        // Remove the timer logic since poop should persist until cleaned

        // Restore some cleanliness after pooping to prevent infinite loop
        this.cleanlinessLevel = Math.min(100, this.cleanlinessLevel + 20)
        console.log("🧹 Cleanliness restored to:", this.cleanlinessLevel)
    }

    private removePoopAtIndex(index: number) {
        if (index < 0 || index >= this.poopObjects.length) return

        const poop = this.poopObjects[index]
        const shadow = this.poopShadows[index]

        // Animate removal
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

        // Remove from arrays
        this.poopObjects.splice(index, 1)
        this.poopShadows.splice(index, 1)
    }

    // ===== PUBLIC METHODS =====

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

    buyCleaning(cleaningId: string): boolean {
        console.log(`🛒 Buying cleaning item: ${cleaningId}`)
        const price = gameConfigManager.getCleaningPrice(cleaningId)

        if (this.colyseusClient && this.colyseusClient.isConnected()) {
            console.log(
                "🌐 Checking tokens before sending purchase request to server"
            )

            // Check if player has enough tokens before sending to server
            // const currentTokens = useUserStore.getState().nomToken
            const currentTokens = store.getState().stateless.user.nomToken
            if (currentTokens < price) {
                console.log(
                    `❌ Not enough tokens: need ${price}, have ${currentTokens}`
                )
                return false
            }

            // Get cleaning item to retrieve both id and name
            const cleaningItem = gameConfigManager.getCleaningItem(cleaningId)
            const itemName = cleaningItem?.name || cleaningId // Fallback to cleaningId if name not found

            this.colyseusClient.purchaseItem("cleaning", itemName, 1, cleaningId)

            return true // Server will handle validation and update inventory
        } else {
            console.log("🔌 Offline mode - using local validation")

            // const userState = useUserStore.getState()
            if (store.dispatch(spendToken(price))) {
                this.cleaningInventory += 1

                console.log(
                    `✅ Purchase successful: ${cleaningId} for ${price} tokens. Inventory: ${this.cleaningInventory}`
                )
                return true
            }

            console.log(
                `❌ Not enough tokens to buy ${cleaningId}. Need: ${price}, Have: ${
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
                `🧹 Used cleaning item! Cleanliness: ${this.cleanlinessLevel}%, Inventory: ${this.cleaningInventory}`
            )
            return true
        }

        console.log("❌ No cleaning items in inventory")
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
