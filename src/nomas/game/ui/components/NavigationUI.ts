/* eslint-disable indent */
import type { GameScene } from "@/nomas/game/GameScene"

const NAV_BG_COLOR = 0x101010 // Inner panel color
const NAV_BORDER_COLOR = 0x242424 // Inner border color
const NAV_OUTER_COLOR = 0x242424 // Outer container color
const NAV_UI_DEPTH = 200 // Ensure above pets and world objects

// Helper function to get responsive button size
function getResponsiveButtonSize(screenWidth: number): {
  size: number
  spacing: number
  iconSize: number
} {
  const size = Math.max(40, Math.min(50, screenWidth / 25))
  return {
    size,
    spacing: size * 0.2,
    iconSize: size * 0.6,
  }
}

export class NavigationUI {
  private scene: GameScene
  private homeButton!: Phaser.GameObjects.Rectangle
  private shopButton!: Phaser.GameObjects.Rectangle
  private settingsButton!: Phaser.GameObjects.Rectangle
  private uiElements: Phaser.GameObjects.GameObject[] = []

  constructor(scene: GameScene) {
    this.scene = scene
  }

  create() {
    console.log("🧭 Creating Navigation UI...")

    const screenWidth = this.scene.cameras.main.width
    const { size: buttonSize, spacing: buttonSpacing } =
      getResponsiveButtonSize(screenWidth)

    const centerY = this.scene.cameras.main.centerY
    const startY = centerY + 40 - buttonSize / 2 // move slightly further below center
    const totalWidth = buttonSize * 3 + buttonSpacing * 2
    const padding = 28 // Slightly increased padding from right edge
    const startX = screenWidth - totalWidth - padding

    // Home Button
    this.createHomeButton(startX, startY, buttonSize)

    // Shop Button
    this.createShopButton(
      startX + buttonSize + buttonSpacing,
      startY,
      buttonSize
    )

    // Settings Button
    this.createSettingsButton(
      startX + (buttonSize + buttonSpacing) * 2,
      startY,
      buttonSize
    )

    console.log("✅ Navigation UI created successfully")
  }

  private createHomeButton(x: number, y: number, buttonSize: number) {
    // Button background
    // Two-layer panel (outer + inner)
    const radius = 8
    const paddingInner = 6
    const { iconSize } = getResponsiveButtonSize(this.scene.cameras.main.width)

    const outer = this.scene.add.graphics()
    outer.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer.fillRoundedRect(x - buttonSize / 2, y, buttonSize, buttonSize, radius)
    outer.setDepth(NAV_UI_DEPTH)

    const panel = this.scene.add.graphics()
    panel.fillStyle(NAV_BG_COLOR, 0.98)
    panel.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel.fillRoundedRect(
      x - buttonSize / 2 + paddingInner,
      y + paddingInner,
      buttonSize - paddingInner * 2,
      buttonSize - paddingInner * 2,
      radius - 4
    )
    panel.strokeRoundedRect(
      x - buttonSize / 2 + paddingInner,
      y + paddingInner,
      buttonSize - paddingInner * 2,
      buttonSize - paddingInner * 2,
      radius - 4
    )
    panel.setDepth(NAV_UI_DEPTH + 1)

    // Transparent hit area on top to keep interactions
    this.homeButton = this.scene.add
      .rectangle(x, y, buttonSize, buttonSize, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer, panel, this.homeButton)

    // Home icon (pixel art style)
    const homeIcon = this.createHomeIcon(x, y + buttonSize / 2, iconSize)
    this.uiElements.push(homeIcon)

    // Click handler
    this.homeButton.on("pointerdown", () => {
      console.log("🏠 Home button clicked")
      this.scene.events.emit("open-react-home")
    })
  }

  private createShopButton(x: number, y: number, buttonSize: number) {
    // Button background
    const radius = 8
    const paddingInner2 = 6
    const { iconSize } = getResponsiveButtonSize(this.scene.cameras.main.width)

    const outer2 = this.scene.add.graphics()
    outer2.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer2.fillRoundedRect(
      x - buttonSize / 2,
      y,
      buttonSize,
      buttonSize,
      radius
    )
    outer2.setDepth(NAV_UI_DEPTH)

    const panel2 = this.scene.add.graphics()
    panel2.fillStyle(NAV_BG_COLOR, 0.98)
    panel2.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel2.fillRoundedRect(
      x - buttonSize / 2 + paddingInner2,
      y + paddingInner2,
      buttonSize - paddingInner2 * 2,
      buttonSize - paddingInner2 * 2,
      radius - 4
    )
    panel2.strokeRoundedRect(
      x - buttonSize / 2 + paddingInner2,
      y + paddingInner2,
      buttonSize - paddingInner2 * 2,
      buttonSize - paddingInner2 * 2,
      radius - 4
    )
    panel2.setDepth(NAV_UI_DEPTH + 1)

    this.shopButton = this.scene.add
      .rectangle(x, y, buttonSize, buttonSize, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer2, panel2, this.shopButton)

    // Shop icon (pixel art style)
    const shopIcon = this.createShopIcon(x, y + buttonSize / 2, iconSize)
    this.uiElements.push(shopIcon)

    // Click handler - open React shop
    this.shopButton.on("pointerdown", () => {
      console.log("🛒 Shop button clicked - opening React shop")
      this.scene.events.emit("open-react-shop")
    })
  }

  private createSettingsButton(x: number, y: number, buttonSize: number) {
    // Button background
    const radius = 8
    const paddingInner3 = 6
    const { iconSize } = getResponsiveButtonSize(this.scene.cameras.main.width)

    const outer3 = this.scene.add.graphics()
    outer3.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer3.fillRoundedRect(
      x - buttonSize / 2,
      y,
      buttonSize,
      buttonSize,
      radius
    )
    outer3.setDepth(NAV_UI_DEPTH)

    const panel3 = this.scene.add.graphics()
    panel3.fillStyle(NAV_BG_COLOR, 0.98)
    panel3.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel3.fillRoundedRect(
      x - buttonSize / 2 + paddingInner3,
      y + paddingInner3,
      buttonSize - paddingInner3 * 2,
      buttonSize - paddingInner3 * 2,
      radius - 4
    )
    panel3.strokeRoundedRect(
      x - buttonSize / 2 + paddingInner3,
      y + paddingInner3,
      buttonSize - paddingInner3 * 2,
      buttonSize - paddingInner3 * 2,
      radius - 4
    )
    panel3.setDepth(NAV_UI_DEPTH + 1)

    this.settingsButton = this.scene.add
      .rectangle(x, y, buttonSize, buttonSize, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer3, panel3, this.settingsButton)

    // Settings icon (pixel art style)
    const settingsIcon = this.createSettingsIcon(
      x,
      y + buttonSize / 2,
      iconSize
    )
    this.uiElements.push(settingsIcon)

    // Click handler
    this.settingsButton.on("pointerdown", () => {
      console.log("⚙️ Settings button clicked")
      // TODO: add modal config game
      // Add settings functionality here if needed
    })
  }

  private createHomeIcon(
    x: number,
    y: number,
    iconSize: number
  ): Phaser.GameObjects.Image {
    // Create a simple house icon using graphics
    return this.scene.add
      .image(x, y, "home")
      .setOrigin(0.5)
      .setDisplaySize(iconSize, iconSize)
      .setDepth(NAV_UI_DEPTH + 3)
  }

  private createShopIcon(
    x: number,
    y: number,
    iconSize: number
  ): Phaser.GameObjects.Image {
    // Use image-based icon (requested: @images/game-ui/setting.png)
    return this.scene.add
      .image(x, y, "shop")
      .setOrigin(0.5)
      .setDisplaySize(iconSize * 0.67, iconSize * 0.67)
      .setDepth(NAV_UI_DEPTH + 3)
  }

  private createSettingsIcon(
    x: number,
    y: number,
    iconSize: number
  ): Phaser.GameObjects.Image {
    // Use the same setting image for settings button
    return this.scene.add
      .image(x, y, "setting")
      .setOrigin(0.5)
      .setDisplaySize(iconSize * 0.67, iconSize * 0.67)
      .setDepth(NAV_UI_DEPTH + 3)
  }

  // ===== Minimize/Restore Functionality =====
  minimize(): void {
    this.uiElements.forEach((element) => {
      this.scene.tweens.add({
        targets: element,
        alpha: 0,
        duration: 300,
        ease: "Power2",
      })
    })
  }

  restore(): void {
    this.uiElements.forEach((element) => {
      this.scene.tweens.add({
        targets: element,
        alpha: 1,
        duration: 300,
        ease: "Power2",
      })
    })
  }

  updatePosition(): void {
    // Destroy old UI elements
    this.uiElements.forEach((element) => element.destroy())
    this.uiElements = []

    // Recreate navigation UI with new positions
    this.create()
  }
}
