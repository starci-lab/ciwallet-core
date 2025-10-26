import { GameScene } from "../../GameScene"

/**
 * CustomCursorManager handles a custom HTML cursor that follows the mouse globally.
 * This allows the cursor to maintain its appearance even when moving outside the game canvas.
 */
export class CustomCursorManager {
    private scene: GameScene
    private cursorElement: HTMLDivElement | null = null
    private isActive = false
    private currentCursorUrl: string | null = null
    private mouseMoveHandler: ((e: MouseEvent) => void) | null = null
    private pointerEnterHandler: (() => void) | null = null
    private pointerLeaveHandler: (() => void) | null = null

    constructor(scene: GameScene) {
        this.scene = scene
        this.createCursorElement()
    }

    private createCursorElement() {
    // Create custom cursor element
        this.cursorElement = document.createElement("div")
        this.cursorElement.id = "custom-game-cursor"
        this.cursorElement.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            display: none;
            width: 64px;
            height: 64px;
            transform: translate(-50%, -50%);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        `
        document.body.appendChild(this.cursorElement)
    }

    /**
   * Activate custom cursor with an item image
   */
    activateCustomCursor(imageUrl: string, size: number = 32) {
        if (!this.cursorElement) return

        this.isActive = true
        this.currentCursorUrl = imageUrl
        this.cursorElement.style.width = `${size}px`
        this.cursorElement.style.height = `${size}px`
        // Set background image
        this.cursorElement.style.backgroundImage = `url(${imageUrl})`
        this.cursorElement.style.display = "block"

        // Hide default cursor on game canvas
        const canvas = this.scene.game.canvas
        if (canvas) {
            canvas.style.cursor = "none"
        }

        // Track mouse movement globally
        this.mouseMoveHandler = (e: MouseEvent) => {
            if (this.cursorElement) {
                this.cursorElement.style.left = `${e.clientX}px`
                this.cursorElement.style.top = `${e.clientY}px`
            }
        }

        document.addEventListener("mousemove", this.mouseMoveHandler)

        // Setup canvas enter/leave listeners to show/hide custom cursor
        if (canvas) {
            this.pointerEnterHandler = () => {
                if (this.cursorElement && this.isActive) {
                    this.cursorElement.style.display = "block"
                    canvas.style.cursor = "none"
                }
            }

            this.pointerLeaveHandler = () => {
                if (this.cursorElement && this.isActive) {
                    this.cursorElement.style.display = "none"
                    canvas.style.cursor = ""
                }
            }

            canvas.addEventListener("pointerenter", this.pointerEnterHandler)
            canvas.addEventListener("pointerleave", this.pointerLeaveHandler)
        }

        console.log("✅ Custom cursor activated with image:", imageUrl)
    }

    /**
   * Deactivate custom cursor and restore default
   */
    deactivateCustomCursor() {
        if (!this.cursorElement) return

        this.isActive = false
        this.currentCursorUrl = null

        // Hide custom cursor
        this.cursorElement.style.display = "none"
        this.cursorElement.style.backgroundImage = ""

        // Restore default cursor on game canvas
        const canvas = this.scene.game.canvas
        if (canvas) {
            canvas.style.cursor = ""

            // Remove canvas enter/leave listeners
            if (this.pointerEnterHandler) {
                canvas.removeEventListener("pointerenter", this.pointerEnterHandler)
                this.pointerEnterHandler = null
            }
            if (this.pointerLeaveHandler) {
                canvas.removeEventListener("pointerleave", this.pointerLeaveHandler)
                this.pointerLeaveHandler = null
            }
        }

        // Restore Phaser default cursor
        this.scene.input.setDefaultCursor(GameScene.DEFAULT_CURSOR)

        // Remove mouse move listener
        if (this.mouseMoveHandler) {
            document.removeEventListener("mousemove", this.mouseMoveHandler)
            this.mouseMoveHandler = null
        }

        console.log("✅ Custom cursor deactivated")
    }

    /**
   * Check if custom cursor is currently active
   */
    isCustomCursorActive(): boolean {
        return this.isActive
    }

    /**
   * Get current cursor image URL
   */
    getCurrentCursorUrl(): string | null {
        return this.currentCursorUrl
    }

    /**
   * Clean up resources
   */
    destroy() {
        this.deactivateCustomCursor()

        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement)
            this.cursorElement = null
        }
    }
}
