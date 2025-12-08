import type { GameScene } from "../GameScene"
import { PetManager, type PetData } from "@/nomas/game/managers/PetManager"
import { NotificationUI } from "./components/NotificationUI"
import { PetDetailsModal } from "./components/PetDetailsModal"
import { InputManager } from "./components/InputManager"

export class GameUI {
    private scene: GameScene
    private petManager: PetManager

    // UI Components
    private notificationUI: NotificationUI
    private petDetailsModal: PetDetailsModal
    private inputManager: InputManager
    // React shop is opened via scene events; no local legacy modal instance

    private isMinimized = false

    constructor(scene: GameScene, petManager: PetManager) {
        this.scene = scene
        this.petManager = petManager

        // Initialize UI components
        this.notificationUI = new NotificationUI(scene)
        this.petDetailsModal = new PetDetailsModal()
        this.inputManager = new InputManager(scene, petManager, this.notificationUI)
        // Legacy ShopModal and ShopUI removed
    }

    create() {
        // Create all UI components
        this.inputManager.setupInputHandlers()
    }

    // Buy Pet Button removed; shop handled via React/scene events

    // Public method for external components (like ColyseusClient) to show notifications
    showNotification(message: string, x?: number, y?: number) {
        this.notificationUI.showNotification(message, x, y)
    }

    // Update all UI components
    updateUI() {
        this.petDetailsModal.update()
    }

    // Debug method to show pet stats
    showPetStats() {
        const stats = this.petManager.getPetStats()
        console.log("🐕 Pet Manager Stats:", stats)
    }

    // Show pet details modal
    showPetDetailsModal(petData: PetData) {
        this.petDetailsModal.show(petData)
    }

    // ===== Minimize/Restore Functionality =====
    minimize(): void {
        if (this.isMinimized) return

        this.isMinimized = true
    }

    restore(): void {
        if (!this.isMinimized) return

        this.isMinimized = false
    }

    getMinimizeState(): boolean {
        return this.isMinimized
    }

    getInputManager(): InputManager {
        return this.inputManager
    }
}
