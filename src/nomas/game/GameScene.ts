/* eslint-disable indent */
import { loadAllAssets } from "@/nomas/game/load/asset"
import Phaser from "phaser"
import { GameUI } from "@/nomas/game/ui/GameUI"
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
import { ReactEventName } from "./events/react"
import { reactBus } from "./events/react/bus"
import {
  ShopEvents,
  type BuyPetPayload,
  type BuyPlaceableItemPayload,
  type BuyImmediateItemPayload,
  type ActivateCursorPayload,
} from "./events/shop/ShopEvents"
import { HomeEvents, type PetDataUpdatePayload } from "./events/home/HomeEvents"
import {
  ColyseusConnectionEvents,
  ColyseusMessageEvents,
  type ColyseusConnectedEvent,
  type ColyseusDisconnectedEvent,
  type ColyseusErrorEvent,
} from "@/nomas/game/colyseus/events"
import { colyseusService } from "@/nomas/game/colyseus/ColyseusService"
// const BACKEND_URL =" https://minute-lifetime-retrieved-referred.trycloudflare.com    "

export class GameScene extends Phaser.Scene {
  // Default cursor for the game
  static readonly DEFAULT_CURSOR =
    "url(../../../public/assets/game/cursor/navigation_nw.png), pointer"
  rexUI!: RexUIPlugin
  private petManager!: PetManager
  private gameUI!: GameUI
  private isInitialized = false
  private backgroundImage?: Phaser.GameObjects.Image
  private pendingColyseusRoom?: unknown
  private tilemapInput?: TilemapInputSystem
  private _purchaseSystem?: PurchaseSystem
  private purchaseUI?: PurchaseUI
  private isMinimized = false // Minimize state

  // Phaser-specific features for Colyseus
  private lastClickPosition: { x: number; y: number } | null = null // Track last click for error notifications
  private connectionStatusText?: Phaser.GameObjects.Text // Connection status UI

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

    await initializeGame()

    // Debug log food items
    gameConfigManager.logFoodItems()

    // Initialize systems
    this.initializeSystems()
    // this.initializePets()
    this.initializeUI()

    // Setup cursor
    this.input.setDefaultCursor(GameScene.DEFAULT_CURSOR)

    // Mark as initialized
    this.isInitialized = true

    // Notify external listeners (React) that assets/UI are ready for multiplayer connect
    this.events.emit("assets-ready")

    // Subscribe to React UI tile events via global event bus
    this.setupTileInputListeners()

    // Subscribe to shop events from ReactShopModal
    this.setupShopEventListeners()

    // Subscribe to home events and setup pet data emission
    this.setupHomeEventListeners()

    // Setup Phaser-specific Colyseus features
    this.setupColyseusPhaserFeatures()

    // Handle Phaser scale resize event
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.handleResize()
    })

    // Add ResizeObserver to detect container resize realtime
    this.setupResizeObserver()

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

    this._purchaseSystem = new PurchaseSystem()
    this.purchaseUI = new PurchaseUI(this)
  }

  private setupResizeObserver() {
    // Get container element
    const containerElement = this.scale.game.canvas?.parentElement
    if (!containerElement) return

    let rafId: number | null = null
    let lastWidth = containerElement.clientWidth

    const resizeObserver = new ResizeObserver(() => {
      const currentWidth = containerElement.clientWidth
      // Only update if width changes (height is fixed)
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth

        // Cancel pending resize to avoid duplicates
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }

        // Resize Phaser game immediately
        if (this.scale.game.isBooted) {
          this.scale.resize(currentWidth, 140)
        }

        // Schedule handleResize after Phaser has updated
        rafId = requestAnimationFrame(() => {
          // Double RAF to ensure Phaser has rendered
          requestAnimationFrame(() => {
            this.handleResize()
            rafId = null
          })
        })
      }
    })

    resizeObserver.observe(containerElement)

    // Cleanup when scene is destroyed
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      resizeObserver.disconnect()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    })
  }

  private handleResize() {
    // Update background
    if (this.backgroundImage) {
      const currentTextureKey = this.backgroundImage.texture.key
      this.createBackground(currentTextureKey)
    }

    // Update all objects through PetManager
    if (this.petManager) {
      this.petManager.updateAllScales()
    }

    // Update UI positions
    if (this.gameUI) {
      this.gameUI.resize()
    }
  }

  private initializeSystems() {
    // Initialize ColyseusService references
    // Note: ColyseusService is already initialized in ColyseusProvider
    // We just need to set PetManager and GameUI references when they're ready
    console.log("🔗 [GameScene] Setting up ColyseusService references...")

    // Initialize pet manager (uses ColyseusService)
    this.petManager = new PetManager(this)

    // Set PetManager in ColyseusService (for future use)
    colyseusService.setPetManager(this.petManager)

    // If a room was provided before systems were ready, attach it now
    // Note: Room is now managed by ColyseusProvider via ColyseusService
    if (this.pendingColyseusRoom) {
      // Room will be set in ColyseusService by ColyseusProvider
      this.pendingColyseusRoom = undefined
    }

    // Request initial pets state after a short delay to ensure connection is ready
    this.time.delayedCall(1000, () => {
      if (colyseusService.isConnected()) {
        console.log("📤 [GameScene] Requesting initial pets state")
        this.petManager.requestPetsState()
      } else {
        console.log(
          "⏳ [GameScene] Waiting for connection before requesting pets state"
        )
        // Retry after connection is established
        eventBus.once("colyseus:connected", () => {
          console.log("✅ [GameScene] Connected, requesting pets state")
          this.petManager.requestPetsState()
        })
      }
    })
  }

  private async initializeUI() {
    // Initialize UI with pet manager
    this.gameUI = new GameUI(this, this.petManager)
    this.gameUI.create()

    // Set GameUI reference in ColyseusService (for notifications)
    colyseusService.setGameUI(this.gameUI)
    console.log(
      "✅ [GameScene] ColyseusService references set (PetManager & GameUI)"
    )

    // Connection is handled by ColyseusProvider, no need to connect here
    reactBus.emit(ReactEventName.GameLoaded)
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

  private setupShopEventListeners() {
    // Handler references for cleanup
    const handleBuyPet = (payload: BuyPetPayload) => {
      this.handleBuyPet(payload)
    }
    const handleStartPlacing = (payload: BuyPlaceableItemPayload) => {
      this.handleStartPlacing(payload)
    }
    const handleBuyFurniture = (payload: BuyImmediateItemPayload) => {
      this.handleBuyFurniture(payload)
    }
    const handleBuyBackground = (payload: BuyImmediateItemPayload) => {
      this.handleBuyBackground(payload)
    }
    const handleActivateCursor = (payload: ActivateCursorPayload) => {
      this.handleActivateCursor(payload)
    }

    // Register listeners
    eventBus.on(ShopEvents.BuyPet, handleBuyPet)
    eventBus.on(ShopEvents.StartPlacing, handleStartPlacing)
    eventBus.on(ShopEvents.BuyFurniture, handleBuyFurniture)
    eventBus.on(ShopEvents.BuyBackground, handleBuyBackground)
    eventBus.on(ShopEvents.ActivateCursor, handleActivateCursor)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventBus.off(ShopEvents.BuyPet, handleBuyPet)
      eventBus.off(ShopEvents.StartPlacing, handleStartPlacing)
      eventBus.off(ShopEvents.BuyFurniture, handleBuyFurniture)
      eventBus.off(ShopEvents.BuyBackground, handleBuyBackground)
      eventBus.off(ShopEvents.ActivateCursor, handleActivateCursor)
    })
  }

  private petDataUpdateInterval?: NodeJS.Timeout

  private setupHomeEventListeners() {
    // Setup periodic pet data emission (every 1 second)
    this.petDataUpdateInterval = setInterval(() => {
      if (this.petManager) {
        const pets = this.petManager.getAllPets()
        const payload: PetDataUpdatePayload = {
          pets,
          timestamp: Date.now(),
        }
        eventBus.emit(HomeEvents.PetDataUpdate, payload)
      }
    }, 1000)

    // Cleanup on scene shutdown
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.petDataUpdateInterval) {
        clearInterval(this.petDataUpdateInterval)
        this.petDataUpdateInterval = undefined
      }
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
    if (this.petDataUpdateInterval) {
      clearInterval(this.petDataUpdateInterval)
      this.petDataUpdateInterval = undefined
    }
  }

  // TODO: UPDATE CLEANLINESS SYSTEM
  update() {
    // Don't update until fully initialized
    if (!this.isInitialized) {
      return
    }

    // Check if managers are initialized
    if (!this.petManager) return

    if (!this.gameUI) return

    try {
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

  // ===== Phaser-Specific Colyseus Features =====

  /**
   * Setup Phaser-specific features for Colyseus:
   * - Click tracking for error notifications
   * - Connection status UI
   * - Event listeners for notifications
   */
  private setupColyseusPhaserFeatures() {
    // Setup click tracking
    const clickHandler = (pointer: Phaser.Input.Pointer) => {
      this.lastClickPosition = { x: pointer.x, y: pointer.y }
    }
    this.input.on("pointerdown", clickHandler)

    // Setup connection status UI event listeners
    const handleConnected = (event: ColyseusConnectedEvent) => {
      this.showConnectionStatus("✅ Connected!", "#00ff00")
      console.log("✅ [GameScene] Colyseus connected:", event.roomId)
    }

    const handleDisconnected = (event: ColyseusDisconnectedEvent) => {
      this.showConnectionStatus("❌ Disconnected", "#ff0000")
      console.log("👋 [GameScene] Colyseus disconnected:", event.code)
    }

    const handleError = (event: ColyseusErrorEvent) => {
      this.showConnectionStatus("❌ Connection Error", "#ff0000")
      console.error("❌ [GameScene] Colyseus error:", event.message)

      // Show error notification at last click position
      if (this.gameUI && this.lastClickPosition) {
        this.gameUI.showNotification(
          `❌ ${event.message}`,
          this.lastClickPosition.x,
          this.lastClickPosition.y
        )
      }
    }

    eventBus.on(ColyseusConnectionEvents.Connected, handleConnected)
    eventBus.on(ColyseusConnectionEvents.Disconnected, handleDisconnected)
    eventBus.on(ColyseusConnectionEvents.Error, handleError)

    // Setup message event listeners for notifications
    const handlePurchaseError = (message: {
      success: boolean
      message: string
    }) => {
      if (!message.success && this.gameUI && this.lastClickPosition) {
        this.gameUI.showNotification(
          `❌ ${message.message}`,
          this.lastClickPosition.x,
          this.lastClickPosition.y
        )
      }
    }

    const handleBuyPetError = (message: {
      success: boolean
      message: string
    }) => {
      if (!message.success && this.gameUI && this.lastClickPosition) {
        this.gameUI.showNotification(
          `❌ ${message.message}`,
          this.lastClickPosition.x,
          this.lastClickPosition.y
        )
      }
    }

    eventBus.on(ColyseusMessageEvents.PurchaseItemResponse, handlePurchaseError)
    eventBus.on(ColyseusMessageEvents.BuyPetResponse, handleBuyPetError)

    // Cleanup on scene shutdown
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      console.log("🧹 [GameScene] Cleaning up Colyseus event listeners")
      this.input.off("pointerdown", clickHandler)
      eventBus.off(ColyseusConnectionEvents.Connected, handleConnected)
      eventBus.off(ColyseusConnectionEvents.Disconnected, handleDisconnected)
      eventBus.off(ColyseusConnectionEvents.Error, handleError)
      eventBus.off(
        ColyseusMessageEvents.PurchaseItemResponse,
        handlePurchaseError
      )
      eventBus.off(ColyseusMessageEvents.BuyPetResponse, handleBuyPetError)
    })
  }

  /**
   * Show connection status text in Phaser scene
   */
  private showConnectionStatus(text: string, color: string = "#ff0000") {
    // Remove previous status text if exists
    if (this.connectionStatusText) {
      this.connectionStatusText.destroy()
    }

    // Create new status text
    this.connectionStatusText = this.add
      .text(10, 70, text)
      .setStyle({ color, fontSize: "12px" })
      .setPadding(4)

    // Auto-hide after 3 seconds (except for errors which persist until reconnection)
    if (text.includes("✅")) {
      this.time.delayedCall(3000, () => {
        if (this.connectionStatusText) {
          this.connectionStatusText.destroy()
          this.connectionStatusText = undefined
        }
      })
    }
  }

  // ===== Multiplayer wiring (for React/use-colyseus) =====
  // Deprecated: Room is now managed by ColyseusProvider via ColyseusService
  // This method is kept for backward compatibility but does nothing
  attachColyseusRoom(_room: unknown) {
    console.log(
      "⚠️ [GameScene] attachColyseusRoom is deprecated - room is managed by ColyseusProvider"
    )
    // Room is automatically set in ColyseusService by ColyseusProvider
  }

  // Deprecated: Connection is now handled by ColyseusProvider
  async connectToColyseus(_url: string = envConfig().colyseus.endpoint) {
    console.log(
      "⚠️ [GameScene] connectToColyseus is deprecated - connection is handled by ColyseusProvider"
    )
    // Connection is automatically handled by ColyseusProvider
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

        // Scale by width to make responsive horizontally
        const scaleX = cameraWidth / textureWidth
        const scaledHeight = textureHeight * scaleX

        // Tạo background image
        this.backgroundImage = this.add.image(0, 0, textureKey)
        this.backgroundImage.setOrigin(0, 0)
        this.backgroundImage.setScale(scaleX)

        // If scaled height is still not enough, scale further by height
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
    if (!colyseusService.isConnected()) return
    colyseusService.purchaseItem(
      payload.itemType,
      payload.itemName,
      payload.quantity,
      payload.itemId
    )
  }

  // ===== Shop Event Handlers =====
  // These methods handle shop events emitted from ReactShopModal

  private handleBuyPet(payload: BuyPetPayload): void {
    try {
      const petType = payload.petType || payload.petName
      this.getPetManager().buyPet(petType, payload.petId)
    } catch (error) {
      console.error("Failed to buy pet", error)
      this.sendBuyFoodLegacy({
        itemType: "pet",
        itemName: payload.petName,
        quantity: 1,
        itemId: payload.petId,
      })
    }
  }

  private handleStartPlacing(payload: BuyPlaceableItemPayload): void {
    this.registry.set("placingItem", {
      type: payload.itemType,
      itemId: payload.itemId,
      itemName: payload.itemName,
      cursorUrl: payload.cursorUrl,
    })

    // Activate cursor - emit event for internal handling
    eventBus.emit(ShopEvents.ActivateCursor, {
      cursorUrl: payload.cursorUrl,
      cursorSize: payload.itemType === "clean" ? 64 : undefined,
      frameWidth: payload.itemType === "clean" ? 74 : undefined,
      frameIndex: payload.itemType === "clean" ? 0 : undefined,
    })
  }

  private handleBuyFurniture(payload: BuyImmediateItemPayload): void {
    this.sendBuyFoodLegacy({
      itemType: "furniture",
      itemName: payload.itemName,
      quantity: 1,
      itemId: payload.itemId,
    })
  }

  private handleBuyBackground(payload: BuyImmediateItemPayload): void {
    this.sendBuyFoodLegacy({
      itemType: "background",
      itemName: payload.itemName,
      quantity: 1,
      itemId: payload.itemId,
    })
  }

  private handleActivateCursor(payload: ActivateCursorPayload): void {
    try {
      const cursorManager = this.getCustomCursorManager()
      if (!cursorManager) {
        console.warn("CustomCursorManager not available")
        return
      }

      const cursorSize = payload.cursorSize || 32
      cursorManager.activateCustomCursor(payload.cursorUrl, cursorSize)
    } catch (error) {
      console.error("Failed to activate custom cursor", error)
    }
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
