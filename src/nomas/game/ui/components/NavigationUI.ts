/* eslint-disable indent */
import type { GameScene } from "@/nomas/game/GameScene"

const NAV_BG_COLOR = 0x101010 // Inner panel color
const NAV_BORDER_COLOR = 0x242424 // Inner border color
const NAV_OUTER_COLOR = 0x242424 // Outer container color
const NAV_BUTTON_SIZE = 50
const NAV_BUTTON_SPACING = 10
const NAV_UI_DEPTH = 200 // Ensure above pets and world objects

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

    const centerY = this.scene.cameras.main.centerY
    const startY = centerY + 40 - NAV_BUTTON_SIZE / 2 // move slightly further below center
    const screenWidth = this.scene.cameras.main.width
    const totalWidth = NAV_BUTTON_SIZE * 3 + NAV_BUTTON_SPACING * 2
    const padding = 28 // Slightly increased padding from right edge
    const startX = screenWidth - totalWidth - padding

    // Home Button
    this.createHomeButton(startX, startY)

    // Shop Button
    this.createShopButton(startX + NAV_BUTTON_SIZE + NAV_BUTTON_SPACING, startY)

    // Settings Button
    this.createSettingsButton(
      startX + (NAV_BUTTON_SIZE + NAV_BUTTON_SPACING) * 2,
      startY
    )

    console.log("✅ Navigation UI created successfully")
  }

  private createHomeButton(x: number, y: number) {
    // Button background
    // Two-layer panel (outer + inner)
    const radius = 8
    const paddingInner = 6

    const outer = this.scene.add.graphics()
    outer.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2,
      y,
      NAV_BUTTON_SIZE,
      NAV_BUTTON_SIZE,
      radius
    )
    outer.setDepth(NAV_UI_DEPTH)

    const panel = this.scene.add.graphics()
    panel.fillStyle(NAV_BG_COLOR, 0.98)
    panel.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner,
      y + paddingInner,
      NAV_BUTTON_SIZE - paddingInner * 2,
      NAV_BUTTON_SIZE - paddingInner * 2,
      radius - 4
    )
    panel.strokeRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner,
      y + paddingInner,
      NAV_BUTTON_SIZE - paddingInner * 2,
      NAV_BUTTON_SIZE - paddingInner * 2,
      radius - 4
    )
    panel.setDepth(NAV_UI_DEPTH + 1)

    // Transparent hit area on top to keep interactions
    this.homeButton = this.scene.add
      .rectangle(x, y, NAV_BUTTON_SIZE, NAV_BUTTON_SIZE, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer, panel, this.homeButton)

    // Home icon (pixel art style)
    const homeIcon = this.createHomeIcon(x, y + 25)
    this.uiElements.push(homeIcon)

    // Click handler
    this.homeButton.on("pointerdown", () => {
      console.log("🏠 Home button clicked")
      this.scene.events.emit("open-react-home")
    })
  }

  private createShopButton(x: number, y: number) {
    // Button background
    const radius = 8
    const paddingInner2 = 6
    const outer2 = this.scene.add.graphics()
    outer2.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer2.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2,
      y,
      NAV_BUTTON_SIZE,
      NAV_BUTTON_SIZE,
      radius
    )
    outer2.setDepth(NAV_UI_DEPTH)

    const panel2 = this.scene.add.graphics()
    panel2.fillStyle(NAV_BG_COLOR, 0.98)
    panel2.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel2.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner2,
      y + paddingInner2,
      NAV_BUTTON_SIZE - paddingInner2 * 2,
      NAV_BUTTON_SIZE - paddingInner2 * 2,
      radius - 4
    )
    panel2.strokeRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner2,
      y + paddingInner2,
      NAV_BUTTON_SIZE - paddingInner2 * 2,
      NAV_BUTTON_SIZE - paddingInner2 * 2,
      radius - 4
    )
    panel2.setDepth(NAV_UI_DEPTH + 1)

    this.shopButton = this.scene.add
      .rectangle(x, y, NAV_BUTTON_SIZE, NAV_BUTTON_SIZE, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer2, panel2, this.shopButton)

    // Shop icon (pixel art style)
    const shopIcon = this.createShopIcon(x, y + 25)
    this.uiElements.push(shopIcon)

    // Click handler - open React shop
    this.shopButton.on("pointerdown", () => {
      console.log("🛒 Shop button clicked - opening React shop")
      this.scene.events.emit("open-react-shop")
    })
  }

  private createSettingsButton(x: number, y: number) {
    // Button background
    const radius = 8
    const paddingInner3 = 6
    const outer3 = this.scene.add.graphics()
    outer3.fillStyle(NAV_OUTER_COLOR, 0.98)
    outer3.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2,
      y,
      NAV_BUTTON_SIZE,
      NAV_BUTTON_SIZE,
      radius
    )
    outer3.setDepth(NAV_UI_DEPTH)

    const panel3 = this.scene.add.graphics()
    panel3.fillStyle(NAV_BG_COLOR, 0.98)
    panel3.lineStyle(2, NAV_BORDER_COLOR, 1)
    panel3.fillRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner3,
      y + paddingInner3,
      NAV_BUTTON_SIZE - paddingInner3 * 2,
      NAV_BUTTON_SIZE - paddingInner3 * 2,
      radius - 4
    )
    panel3.strokeRoundedRect(
      x - NAV_BUTTON_SIZE / 2 + paddingInner3,
      y + paddingInner3,
      NAV_BUTTON_SIZE - paddingInner3 * 2,
      NAV_BUTTON_SIZE - paddingInner3 * 2,
      radius - 4
    )
    panel3.setDepth(NAV_UI_DEPTH + 1)

    this.settingsButton = this.scene.add
      .rectangle(x, y, NAV_BUTTON_SIZE, NAV_BUTTON_SIZE, 0x000000, 0)
      .setOrigin(0.5, 0)
      .setDepth(NAV_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true })

    // Store UI elements for minimize/restore
    this.uiElements.push(outer3, panel3, this.settingsButton)

    // Settings icon (pixel art style)
    const settingsIcon = this.createSettingsIcon(x, y + 25)
    this.uiElements.push(settingsIcon)

    // Click handler
    this.settingsButton.on("pointerdown", () => {
      console.log("⚙️ Settings button clicked")
      // TODO: add modal config game
      // Add settings functionality here if needed
    })
  }

  private createHomeIcon(x: number, y: number): Phaser.GameObjects.Image {
    // Create a simple house icon using graphics
    return this.scene.add
      .image(x, y, "home")
      .setOrigin(0.5)
      .setDisplaySize(30, 30)
      .setDepth(NAV_UI_DEPTH + 3)
  }

  private createShopIcon(x: number, y: number): Phaser.GameObjects.Image {
    // Use image-based icon (requested: @images/game-ui/setting.png)
    return this.scene.add
      .image(x, y, "shop")
      .setOrigin(0.5)
      .setDisplaySize(20, 20)
      .setDepth(NAV_UI_DEPTH + 3)
  }

  private createSettingsIcon(x: number, y: number): Phaser.GameObjects.Image {
    // Use the same setting image for settings button
    return this.scene.add
      .image(x, y, "setting")
      .setOrigin(0.5)
      .setDisplaySize(20, 20)
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
}
