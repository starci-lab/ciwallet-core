import { store } from "@/nomas/redux"

const UI_FONT = "monospace"
const TOKEN_BG_COLOR = 0x101010 // Inner panel color
const TOKEN_BORDER_COLOR = 0x242424 // Inner border color
const TOKEN_OUTER_COLOR = 0x242424 // Outer container color
const TOKEN_TEXT_COLOR = "#b3b3b3" // Light gray text
const TOKEN_UI_DEPTH = 200 // Ensure above pets and world objects

// Helper function to get responsive token UI sizes
function getResponsiveTokenSizes(screenWidth: number): { width: number; height: number; fontSize: number; iconSize: number } {
    const width = Math.max(150, Math.min(200, screenWidth / 8))
    const height = Math.max(32, Math.min(40, screenWidth / 40))
    const fontSize = Math.max(12, Math.min(16, screenWidth / 100))
    const iconSize = Math.max(12, Math.min(16, screenWidth / 100))
    return { width, height, fontSize, iconSize }
}

export class TokenUI {
    private scene: Phaser.Scene
    private tokenText!: Phaser.GameObjects.Text
    private uiElements: Phaser.GameObjects.GameObject[] = []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    create() {
        const screenWidth = this.scene.cameras.main.width
        const { width: tokenWidth, height: tokenHeight, fontSize, iconSize } = getResponsiveTokenSizes(screenWidth)
        
        const padding = 28 // Match NavigationUI right padding
        const tokenX = screenWidth - padding - tokenWidth / 2 // keep right-aligned X
        const centerY = this.scene.cameras.main.centerY
        const tokenY = centerY - 10 - tokenHeight / 2 // move slightly downward

        // Two-layer panel (outer container + inner with padding)
        const outerRadius = 8
        const innerRadius = 8
        const paddingInner = 6

        const outer = this.scene.add.graphics()
        outer.fillStyle(TOKEN_OUTER_COLOR, 0.98)
        outer.fillRoundedRect(
            tokenX - tokenWidth / 2,
            tokenY,
            tokenWidth,
            tokenHeight,
            outerRadius
        )
        outer.setDepth(TOKEN_UI_DEPTH)

        const inner = this.scene.add.graphics()
        inner.fillStyle(TOKEN_BG_COLOR, 0.98)
        inner.lineStyle(2, TOKEN_BORDER_COLOR, 1)
        inner.fillRoundedRect(
            tokenX - tokenWidth / 2 + paddingInner,
            tokenY + paddingInner,
            tokenWidth - paddingInner * 2,
            tokenHeight - paddingInner * 2,
            innerRadius
        )
        inner.strokeRoundedRect(
            tokenX - tokenWidth / 2 + paddingInner,
            tokenY + paddingInner,
            tokenWidth - paddingInner * 2,
            tokenHeight - paddingInner * 2,
            innerRadius
        )
        inner.setDepth(TOKEN_UI_DEPTH + 1)

        // Token icon: use pixel coin sprite
        const tokenIcon = this.scene.add
            .image(tokenX - tokenWidth * 0.35, tokenY + tokenHeight / 2, "coin")
            .setDepth(TOKEN_UI_DEPTH + 2)
            .setOrigin(0.5)
            .setDisplaySize(iconSize, iconSize)

        // Token amount text
        this.tokenText = this.scene.add
            .text(tokenX + tokenWidth * 0.1, tokenY + tokenHeight / 2, "", {
                fontSize: fontSize + "px",
                color: TOKEN_TEXT_COLOR,
                fontStyle: "bold",
                fontFamily: UI_FONT,
                align: "left",
            })
            .setOrigin(0, 0.5)
            .setDepth(TOKEN_UI_DEPTH + 3)

        // Store UI elements for minimize/restore
        this.uiElements.push(outer, inner, tokenIcon, this.tokenText)

        this.update()
    }

    getTokenIconPosition() {
        return { x: this.tokenText.x, y: this.tokenText.y }
    }

    update() {
        const nomToken = store.getState().stateless.user.nomToken
        this.tokenText.setText(nomToken.toLocaleString())
    }

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

        // Recreate token UI with new positions
        this.create()
    }
}
