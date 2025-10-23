import { PetManager } from "@/nomas/game/managers/PetManager"
import type { NotificationUI } from "./NotificationUI"

// Removed unused UI_FONT constant

export class InputManager {
    private scene: Phaser.Scene
    private petManager: PetManager
    private notificationUI: NotificationUI

    constructor(
        scene: Phaser.Scene,
        petManager: PetManager,
        notificationUI: NotificationUI
    ) {
        this.scene = scene
        this.petManager = petManager
        this.notificationUI = notificationUI
    // Legacy ShopUI removed
    }

    setupInputHandlers() {
        console.log("⌨️ Setting up input handlers...")

        // Track click timing for double click detection
        let lastClickTime = 0
        const DOUBLE_CLICK_THRESHOLD = 300 // ms

        // Main click handler for pet interaction
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const currentTime = Date.now()
            const isDoubleClick = currentTime - lastClickTime < DOUBLE_CLICK_THRESHOLD
            lastClickTime = currentTime

            // Check placing state first (deferred purchase from React shop)
            const placing = this.scene.registry.get("placingItem") as
        | {
            type: string
            itemId: string
            itemName?: string
            cursorUrl?: string
          }
        | undefined
            if (placing && placing.type === "food") {
                if (isDoubleClick) {
                    // Cancel placing on double tap: restore default cursor and clear state
                    this.scene.input.setDefaultCursor(
                        "url(./src/assets/images/cursor/navigation_nw.png), pointer"
                    )
                    this.scene.registry.set("placingItem", undefined)
                    this.notificationUI.showNotification(
                        "Canceled placement",
                        pointer.x,
                        pointer.y
                    )
                    return // consume click
                }
                // Single tap: drop and buy, keep placing mode active for multi-drop
                this.petManager.buyAndDropFood(pointer.x, pointer.y, placing.itemId)
                // No notification per UX request; remain in placing mode on single tap
                return // consume click regardless
            }

            if (placing && placing.type === "toy") {
                if (isDoubleClick) {
                    // Cancel placing on double tap: restore default cursor and clear state
                    this.scene.input.setDefaultCursor(
                        "url(./src/assets/images/cursor/navigation_nw.png), pointer"
                    )
                    this.scene.registry.set("placingItem", undefined)
                    this.notificationUI.showNotification(
                        "Canceled placement",
                        pointer.x,
                        pointer.y
                    )
                    return // consume click
                }
                // Single tap: drop and buy toy, keep placing mode active for multi-drop
                this.petManager.buyAndDropToy(pointer.x, pointer.y, placing.itemId)
                // No notification per UX request; remain in placing mode on single tap
                return // consume click regardless
            }

            if (isDoubleClick) {
                // Double click - pet interaction
                this.handlePetInteraction(pointer.x, pointer.y)
            } else {
                // Single click - basic interaction
                this.handleSingleClick(pointer.x, pointer.y)
            }
        })

        console.log("✅ Input handlers set up successfully")
    }

    private handlePetInteraction(x: number, y: number) {
        const activePet = this.petManager.getActivePet()
        if (!activePet) {
            console.log("No active pet to interact with")
            return
        }

        // Check if click is near the pet
        const petBounds = activePet.pet.sprite.getBounds()
        const distance = Phaser.Math.Distance.Between(
            x,
            y,
            petBounds.centerX,
            petBounds.centerY
        )

        if (distance < 100) {
            // Within interaction range
            // Random pet interaction
            const interactions = ["play", "feed", "pet"]
            const randomInteraction =
        interactions[Math.floor(Math.random() * interactions.length)]

            activePet.pet.setUserActivity(randomInteraction)
            this.notificationUI.showNotification(
                `Pet interaction: ${randomInteraction}`,
                x,
                y
            )

            console.log(`🐕 Pet interaction: ${randomInteraction}`)
        }
    }

    private handleSingleClick(x: number, y: number) {
    // Basic single click handling
        console.log(`🖱️ Single click at (${x}, ${y})`)
    }
}
