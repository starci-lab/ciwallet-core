/* eslint-disable indent */
import { PetManager } from "@/nomas/game/managers/PetManager"

const UI_PADDING = 8

export class CleanlinessUI {
  private scene: Phaser.Scene
  private petManager: PetManager
  private cleanlinessLabel!: Phaser.GameObjects.Text
  private cleanlinessBar!: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, petManager: PetManager) {
    this.scene = scene
    this.petManager = petManager
  }

  create() {
    const screenWidth = this.scene.cameras.main.width
    const middleX = screenWidth * 0.5 - 50
    const topPadding = 10
    this.cleanlinessLabel = this.scene.add.text(
      middleX,
      topPadding,
      "Cleanliness:",
      {
        fontSize: "16px",
        color: "#333333",
        backgroundColor: "transparent",
        padding: { x: UI_PADDING, y: 4 },
      }
    )

    const activePet = this.petManager.getActivePet()
    this.cleanlinessBar = this.scene.add
      .rectangle(
        middleX,
        40, // Same Y as hunger bar
        activePet?.cleanlinessSystem.cleanlinessLevel || 100,
        10,
        0x4caf50 // Green color for clean
      )
      .setOrigin(0, 0.5)
  }

  update() {
    const activePet = this.petManager.getActivePet()

    if (this.cleanlinessBar && activePet) {
      const cleanlinessLevel = activePet.cleanlinessSystem.cleanlinessLevel
      this.cleanlinessBar.setSize(cleanlinessLevel, 10)

      // Color coding based on cleanliness level
      let barColor: number
      if (cleanlinessLevel >= 80) {
        barColor = 0x4caf50 // Green - Very Clean
      } else if (cleanlinessLevel >= 60) {
        barColor = 0x8bc34a // Light Green - Clean
      } else if (cleanlinessLevel >= 40) {
        barColor = 0xffeb3b // Yellow - Neutral
      } else if (cleanlinessLevel >= 20) {
        barColor = 0xff9800 // Orange - Dirty
      } else {
        barColor = 0xf44336 // Red - Very Dirty
      }
      this.cleanlinessBar.setFillStyle(barColor)
    }
  }

  destroy() {
    this.cleanlinessLabel?.destroy()
    this.cleanlinessBar?.destroy()
  }

  minimize(): void {
    if (this.cleanlinessLabel) {
      this.scene.tweens.add({
        targets: this.cleanlinessLabel,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.cleanlinessBar) {
      this.scene.tweens.add({
        targets: this.cleanlinessBar,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
  }

  restore(): void {
    if (this.cleanlinessLabel) {
      this.scene.tweens.add({
        targets: this.cleanlinessLabel,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.cleanlinessBar) {
      this.scene.tweens.add({
        targets: this.cleanlinessBar,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
  }
}
