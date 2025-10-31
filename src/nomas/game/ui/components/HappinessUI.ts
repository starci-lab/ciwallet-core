/* eslint-disable indent */
import { PetManager } from "@/nomas/game/managers/PetManager"

const UI_PADDING = 8

export class HappinessUI {
  private scene: Phaser.Scene
  private petManager: PetManager
  private happinessLabel!: Phaser.GameObjects.Text
  private happinessBar!: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, petManager: PetManager) {
    this.scene = scene
    this.petManager = petManager
  }

  create() {
    const screenWidth = this.scene.cameras.main.width
    const leftPadding = screenWidth * 0.02
    const rightX = leftPadding + 270 // Gần Cleanliness hơn, cách thêm 140px
    const topPadding = 10
    
    // Responsive font size and bar height
    const fontSize = Math.max(12, Math.min(16, screenWidth / 80))
    const barHeight = Math.max(8, Math.min(12, screenWidth / 160))
    
    this.happinessLabel = this.scene.add.text(
      rightX,
      topPadding,
      "Happiness:",
      {
        fontSize: fontSize + "px",
        color: "#333333",
        backgroundColor: "transparent",
        padding: { x: UI_PADDING, y: 4 },
      }
    )

    const activePet = this.petManager.getActivePet()
    this.happinessBar = this.scene.add
      .rectangle(
        rightX,
        40, // Same Y as other bars
        activePet?.happinessSystem.happinessLevel || 100,
        barHeight,
        0x4a90e2 // Blue color for happiness
      )
      .setOrigin(0, 0.5)
  }

  update() {
    const activePet = this.petManager.getActivePet()

    if (this.happinessBar && activePet) {
      const happinessLevel = activePet.happinessSystem.happinessLevel
      this.happinessBar.setSize(happinessLevel, 10)

      // Color coding based on happiness level
      let barColor: number
      if (happinessLevel >= 80) {
        barColor = 0x4a90e2 // Blue for happy
      } else if (happinessLevel >= 60) {
        barColor = 0x8bc34a // Light Green for content
      } else if (happinessLevel >= 40) {
        barColor = 0xffeb3b // Yellow for neutral
      } else if (happinessLevel >= 20) {
        barColor = 0xff9800 // Orange for sad
      } else {
        barColor = 0xf44336 // Red for very sad
      }
      this.happinessBar.setFillStyle(barColor)
    }
  }

  destroy() {
    this.happinessLabel?.destroy()
    this.happinessBar?.destroy()
  }

  minimize(): void {
    if (this.happinessLabel) {
      this.scene.tweens.add({
        targets: this.happinessLabel,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.happinessBar) {
      this.scene.tweens.add({
        targets: this.happinessBar,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    }
  }

  restore(): void {
    if (this.happinessLabel) {
      this.scene.tweens.add({
        targets: this.happinessLabel,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
    if (this.happinessBar) {
      this.scene.tweens.add({
        targets: this.happinessBar,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    }
  }

  updatePosition(): void {
    const screenWidth = this.scene.cameras.main.width
    const leftPadding = screenWidth * 0.02
    const rightX = leftPadding + 270 // Gần Cleanliness hơn, cách thêm 140px
    const topPadding = 10
    
    // Responsive sizes
    const fontSize = Math.max(12, Math.min(16, screenWidth / 80))
    const barHeight = Math.max(8, Math.min(12, screenWidth / 160))

    if (this.happinessLabel) {
      this.happinessLabel.setPosition(rightX, topPadding)
      this.happinessLabel.setFontSize(fontSize)
    }
    if (this.happinessBar) {
      this.happinessBar.setPosition(rightX, 40)
      this.happinessBar.height = barHeight
    }
  }
}
