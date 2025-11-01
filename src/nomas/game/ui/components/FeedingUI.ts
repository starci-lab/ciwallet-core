/* eslint-disable indent */
import { PetManager } from "@/nomas/game/managers/PetManager"

const UI_PADDING = 8

export class FeedingUI {
  private scene: Phaser.Scene
  private petManager: PetManager
  private inventoryText!: Phaser.GameObjects.Text
  private hungerBar!: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, petManager: PetManager) {
    this.scene = scene
    this.petManager = petManager
  }

  create() {
    console.log("🍔 Creating Feeding UI...")
    const activePet = this.petManager.getActivePet()
    console.log("Active pet for UI:", activePet ? activePet.id : "None")

    // use responsive position - left edge of padding
    const screenWidth = this.scene.cameras.main.width
    const leftPadding = screenWidth * 0.02
    const topPadding = 10

    // Responsive font size (12-16px based on screen width)
    const fontSize = Math.max(12, Math.min(16, screenWidth / 80))

    // Responsive bar height (8-12px based on screen width)
    const barHeight = Math.max(8, Math.min(12, screenWidth / 160))

    this.inventoryText = this.scene.add.text(
      leftPadding,
      topPadding,
      `Food: ${this.petManager.getFoodInventory()}`,
      {
        fontSize: fontSize + "px",
        color: "#333333",
        backgroundColor: "transparent", // Không cần nền
        padding: { x: UI_PADDING, y: 4 },
      }
    )

    // Không vẽ thanh nền hunger (đỏ) để nền trong suốt
    this.hungerBar = this.scene.add
      .rectangle(
        leftPadding,
        40,
        activePet?.feedingSystem.hungerLevel || 100,
        barHeight,
        0x00ff00
      )
      .setOrigin(0, 0.5)

    console.log("✅ Feeding UI created")
  }

  update() {
    const stats = this.petManager.getPetStats()
    const activePet = this.petManager.getActivePet()

    if (this.inventoryText) {
      this.inventoryText.setText(`Food: ${stats.totalFoodInventory}`)
    }
    if (this.hungerBar && activePet) {
      this.hungerBar.setSize(activePet.feedingSystem.hungerLevel, 10)
    }
  }

  minimize(): void {
    if (this.inventoryText) {
      this.scene.tweens.add({
        targets: this.inventoryText,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.hungerBar) {
      this.scene.tweens.add({
        targets: this.hungerBar,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
  }

  restore(): void {
    if (this.inventoryText) {
      this.scene.tweens.add({
        targets: this.inventoryText,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.hungerBar) {
      this.scene.tweens.add({
        targets: this.hungerBar,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
  }

  updatePosition(): void {
    const screenWidth = this.scene.cameras.main.width
    const leftPadding = screenWidth * 0.02
    const topPadding = 10

    // Responsive sizes
    const fontSize = Math.max(12, Math.min(16, screenWidth / 80))
    const barHeight = Math.max(8, Math.min(12, screenWidth / 160))

    if (this.inventoryText) {
      this.inventoryText.setPosition(leftPadding, topPadding)
      this.inventoryText.setFontSize(fontSize)
    }
    if (this.hungerBar) {
      this.hungerBar.setPosition(leftPadding, 40)
      this.hungerBar.height = barHeight
    }
  }
}
