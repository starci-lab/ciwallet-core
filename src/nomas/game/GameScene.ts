/* eslint-disable indent */
import { loadAllAssets } from "@/nomas/game/load/asset"
import Phaser from "phaser"
import { GameUI } from "@/nomas/game/ui/GameUI"
import { ColyseusClient } from "@/nomas/game/colyseus/client"
import { initializeGame } from "@/nomas/game/game-init"
import { PetManager } from "@/nomas/game/managers/PetManager"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import { GamePositioning } from "@/nomas/game/constants/gameConstants"
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"
import { eventBus, EventNames } from "@/nomas/game/event-bus"
import { TilemapInputSystem } from "@/nomas/game/tilemap/TileMapInputSystem"
import { PurchaseUI } from "@/nomas/game/ui/PurchaseUI"
import { PurchaseSystem } from "@/nomas/game/systems"
import { SceneName } from "@/nomas/game/types"
import { envConfig } from "../env"
// const BACKEND_URL =" https://minute-lifetime-retrieved-referred.trycloudflare.com    "

export class GameScene extends Phaser.Scene {
  // Default cursor for the game
  static readonly DEFAULT_CURSOR =
    "url(../../../public/assets/game/cursor/navigation_nw.png), pointer"
  rexUI!: RexUIPlugin
  private petManager!: PetManager
  private gameUI!: GameUI
  private colyseusClient!: ColyseusClient
  private isInitialized = false
  private backgroundImage?: Phaser.GameObjects.Image
  private pendingColyseusRoom?: unknown
  private tilemapInput?: TilemapInputSystem
  private _purchaseSystem?: PurchaseSystem
  private purchaseUI?: PurchaseUI
  private isMinimized = false // Minimize state

  constructor() {
    super({ key: SceneName.Gameplay })
  }
  preload() {
    loadAllAssets(this)
  }
  async create() {
    // Disable browser context menu on right click for the whole scene
    this.input.mouse?.disableContextMenu()
    // Add background image (default)
    this.createBackground()

    // Initialize game configuration first
    console.log("🎮 Initializing game configuration...")
    await initializeGame()

    // Debug log food items
    gameConfigManager.logFoodItems()

    // Initialize systems
    this.initializeSystems()
    this.initializePets()
    this.initializeUI()

    // Setup cursor
    this.input.setDefaultCursor(GameScene.DEFAULT_CURSOR)

    // Multiplayer connection is managed externally (React via use-colyseus) or via explicit call
    console.log(
      "🏁 Scene initialization complete (waiting for multiplayer attach/connect)"
    )

    // Mark as initialized
    this.isInitialized = true
    console.log("✅ GameScene fully initialized")

    // Notify external listeners (React) that assets/UI are ready for multiplayer connect
    this.events.emit("assets-ready")

    // Subscribe to React UI tile events via global event bus
    this.setupTileInputListeners()

    // Handle Phaser scale resize event
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.handleResize()
    })

    // Thêm ResizeObserver để detect container resize realtime
    this.setupResizeObserver()

    // Initialize Phaser-native tilemap input for the bottom HUD area
    const tileWidth = this.cameras.main.width / 32
    const tileHeight = this.cameras.main.height / 5
    this.tilemapInput = new TilemapInputSystem(this, {
      rows: 1,
      cols: 32,
      tileWidth: tileWidth,
      tileHeight: tileHeight,
      offsetX: 0,
      offsetY: this.cameras.main.height - tileHeight,
      drawGrid: false,
    })

    // Initialize purchase system
    this._purchaseSystem = new PurchaseSystem(this.colyseusClient)
    this.purchaseUI = new PurchaseUI(this)
  }

  private setupResizeObserver() {
    // Get container element
    const containerElement = this.scale.game.canvas?.parentElement
    if (!containerElement) {
      console.warn("⚠️ Container element not found for ResizeObserver")
      return
    }

    let rafId: number | null = null
    let lastWidth = containerElement.clientWidth

    const resizeObserver = new ResizeObserver(() => {
      const currentWidth = containerElement.clientWidth
      // Chỉ update nếu width thay đổi (height cố định)
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth

        // Cancel pending resize để tránh duplicate
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }

        // Resize Phaser game ngay lập tức
        if (this.scale.game.isBooted) {
          this.scale.resize(currentWidth, 140)
        }

        // Schedule handleResize sau khi Phaser đã update
        rafId = requestAnimationFrame(() => {
          // Double RAF để đảm bảo Phaser đã render xong
          requestAnimationFrame(() => {
            this.handleResize()
            rafId = null
          })
        })
      }
    })

    resizeObserver.observe(containerElement)

    // Cleanup khi scene destroy
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      resizeObserver.disconnect()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    })
  }

  private handleResize() {
    const cameraWidth = this.cameras.main.width
    const cameraHeight = this.cameras.main.height

    // Update background
    if (this.backgroundImage) {
      const currentTextureKey = this.backgroundImage.texture.key
      this.createBackground(currentTextureKey)
    }

    // Update tất cả vật thể qua PetManager
    if (this.petManager) {
      this.petManager.updateAllScales()
    }

    // Update UI positions
    if (this.gameUI) {
      this.gameUI.resize()
    }

    console.log(`📐 Game resized: ${cameraWidth}x${cameraHeight}`)
  }

  private initializeSystems() {
    // Initialize multiplayer client first
    this.colyseusClient = new ColyseusClient(this)
    // Initialize pet manager
    this.petManager = new PetManager(this, this.colyseusClient)
    // If a room was provided before systems were ready, attach it now
    if (this.pendingColyseusRoom) {
      this.colyseusClient.attachRoom(this.pendingColyseusRoom)
      this.pendingColyseusRoom = undefined
    }
  }

  private initializePets() {
    console.log("🐕 Pet initialization - waiting for server sync...")
    // Don't create initial pets locally when using Colyseus
    // The server will create and sync the starter pet automatically
    // This prevents conflicts between local and server pet IDs
  }

  private initializeUI() {
    // Initialize UI with pet manager
    this.gameUI = new GameUI(this, this.petManager)
    this.gameUI.create()

    // Set GameUI reference in ColyseusClient for notifications
    this.colyseusClient.setGameUI(this.gameUI)
    // Connect to Colyseus after UI is ready
    this.connectToColyseus().catch((error) => {
      console.error("❌ Failed to connect to Colyseus:", error)
    })
  }

  private setupTileInputListeners() {
    const handleTileSelected = (payload: {
      tile: { row: number; col: number }
      worldX: number
      worldY: number
    }) => {
      try {
        // Example: Move active pet horizontally based on tile col
        const active = this.petManager.getActivePet()
        if (!active) return
        const cameraWidth = this.cameras.main.width
        const cols = 32
        const x = (payload.tile.col + 0.5) * (cameraWidth / cols)
        const y = GamePositioning.getPetY(this.cameras.main.height)
        active.pet.startChasing(x, y)
      } catch (e) {
        console.error("Tile select handling error", e)
      }
    }

    eventBus.on(EventNames.TileSelected, handleTileSelected)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventBus.off(EventNames.TileSelected, handleTileSelected)
    })
  }

  shutdown() {
    if (this.tilemapInput) {
      this.tilemapInput.destroy()
      this.tilemapInput = undefined
    }
    if (this.purchaseUI) {
      this.purchaseUI.destroy()
      this.purchaseUI = undefined
    }
  }

  // TODO: UPDATE CLEANLINESS SYSTEM
  update() {
    // Don't update until fully initialized
    if (!this.isInitialized) {
      return
    }

    // Check if managers are initialized
    if (!this.petManager) {
      return
    }

    if (!this.gameUI) {
      return
    }

    try {
      // Update all pets through manager
      // auto update 60 lần 1 giây
      this.petManager.update()

      // Update UI
      this.gameUI.updateUI()
    } catch (error) {
      console.error("❌ Error in GameScene.update():", error)
    }
  }

  // Compatibility methods for React component
  get speed() {
    const activePet = this.petManager.getActivePet()
    return activePet?.pet.speed || 0
  }

  set speed(value: number) {
    const activePet = this.petManager.getActivePet()
    if (activePet) {
      activePet.pet.speed = value
    }
  }

  get currentActivity() {
    const activePet = this.petManager.getActivePet()
    return activePet?.pet.currentActivity || "idle"
  }

  set currentActivity(value: string) {
    const activePet = this.petManager.getActivePet()
    if (activePet) {
      activePet.pet.setActivity(value)
    }
  }

  updateSpeed(newSpeed: number) {
    const activePet = this.petManager.getActivePet()
    if (activePet) {
      activePet.pet.speed = newSpeed
    }
  }

  setUserActivity(newActivity: string) {
    const activePet = this.petManager.getActivePet()
    if (activePet) {
      activePet.pet.setUserActivity(newActivity)
    }
  }

  // New methods for multi-pet management
  getPetManager(): PetManager {
    return this.petManager
  }

  addPet(petId: string, x?: number, y?: number, petType?: string): boolean {
    const petData = this.petManager.createPet(
      petId,
      x || Math.random() * 300 + 50,
      y || GamePositioning.getPetY(this.cameras.main.height),
      petType || "chog"
    )
    return !!petData
  }

  removePet(petId: string): boolean {
    return this.petManager.removePet(petId)
  }

  switchToPet(petId: string): boolean {
    return this.petManager.setActivePet(petId)
  }

  // Debug method
  forceResetPets(): void {
    this.petManager.forceResetAllPets()
  }

  // ===== Multiplayer wiring (for React/use-colyseus) =====
  attachColyseusRoom(room: unknown) {
    if (!this.colyseusClient) {
      // Defer until systems are initialized
      this.pendingColyseusRoom = room
      return
    }
    this.colyseusClient.attachRoom(room)
  }

  async connectToColyseus(url: string = envConfig().colyseus.endpoint) {
    await this.colyseusClient.connect(url)
  }

  // Create or update background image
  createBackground(textureKey: string = "game-background") {
    const cameraWidth = this.cameras.main.width
    const cameraHeight = this.cameras.main.height

    // Remove previous background if exists
    if (this.backgroundImage) {
      this.backgroundImage.destroy()
      this.backgroundImage = undefined
    }

    try {
      const texture = this.textures.get(textureKey)
      if (texture) {
        const textureWidth = texture.source[0].width
        const textureHeight = texture.source[0].height

        // Scale theo width để responsive ngang
        const scaleX = cameraWidth / textureWidth
        const scaledHeight = textureHeight * scaleX

        // Tạo background image
        this.backgroundImage = this.add.image(0, 0, textureKey)
        this.backgroundImage.setOrigin(0, 0)
        this.backgroundImage.setScale(scaleX)

        // Nếu scaled height vẫn chưa đủ, scale thêm theo height
        if (scaledHeight < cameraHeight) {
          const additionalScale = cameraHeight / scaledHeight
          this.backgroundImage.setScale(scaleX * additionalScale)
        }

        // Align top-left
        this.backgroundImage.setX(0)
        this.backgroundImage.setY(0)
      } else {
        // Fallback
        this.backgroundImage = this.add.image(0, 0, textureKey)
        this.backgroundImage.setOrigin(0, 0)
        this.backgroundImage.setDisplaySize(cameraWidth, cameraHeight)
      }

      this.backgroundImage.setDepth(-100)

      console.log(
        `✅ Background '${textureKey}' loaded with responsive scaling`
      )
    } catch {
      this.createGradientBackground()
    }
  }

  // ===== Minimize/Restore Methods =====
  minimizeUI(): void {
    this.isMinimized = true
    if (this.gameUI) {
      this.gameUI.minimize()
    }
    console.log("🎮 Game UI minimized")
  }

  restoreUI(): void {
    this.isMinimized = false
    if (this.gameUI) {
      this.gameUI.restore()
    }
    console.log("🎮 Game UI restored")
  }

  toggleMinimize(): void {
    if (this.isMinimized) {
      this.restoreUI()
    } else {
      this.minimizeUI()
    }
  }

  getMinimizeState(): boolean {
    return this.isMinimized
  }

  // ===== Exposed getters for React UI integration =====
  getPurchaseSystem(): PurchaseSystem | undefined {
    return this._purchaseSystem
  }

  getCustomCursorManager() {
    return this.gameUI?.getInputManager()?.getCustomCursorManager()
  }

  // Temporary legacy hook: send buy_food with requested payload
  sendBuyFoodLegacy(payload: {
    itemType: string
    itemName: string
    quantity: number
    itemId: string
  }) {
    if (!this.colyseusClient) return
    this.colyseusClient.purchaseItem(
      payload.itemType,
      payload.itemName,
      payload.quantity,
      payload.itemId
    )
  }

  private createGradientBackground() {
    const cameraWidth = this.cameras.main.width
    const cameraHeight = this.cameras.main.height

    // Create a simple gradient background as fallback
    const graphics = this.add.graphics()

    // Sky gradient (light blue to white)
    graphics.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f6ff, 0xe0f6ff)
    graphics.fillRect(0, 0, cameraWidth, cameraHeight)
    graphics.setDepth(-100)

    console.log("✅ Gradient background created as fallback")
  }
}
