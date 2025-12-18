/* eslint-disable indent */
import Phaser from "phaser"
import { GamePositioning, GAME_LAYOUT } from "@/nomas/game/constants/gameConstants"

export class Pet {
    public sprite!: Phaser.GameObjects.Sprite
    public direction: number = 1
    public speed: number = 50
    public currentActivity: string = "walk"
    public isMoving: boolean = true
    public isUserControlled: boolean = false
    public lastEdgeHit: string = ""
    public groundY: number = 0 // Ground line Y position
    public petType: string = "chog" // Pet species/type

    // Cleanliness properties - thuộc tính riêng của mỗi pet
    public cleanlinessDecreaseMultiplier: number // Tốc độ giảm riêng cho mỗi pet

    // Happiness properties - thuộc tính riêng của mỗi pet
    public happinessDecreaseMultiplier: number // Tốc độ giảm riêng cho mỗi pet

    // Chasing properties
    public isChasing: boolean = false
    public chaseTarget: { x: number; y: number } | null = null

    // Callback for when pet stops chasing (to notify PetManager)
    public onStopChasing?: () => void

    // Callback for when pet is clicked (to notify PetManager to switch active pet)
    public onPetClicked?: () => void
    public onPetRightClicked?: () => void

    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene, petType: string = "chog") {
        this.scene = scene
        this.petType = petType.toLowerCase()

        console.log("🐕 [Pet] Constructor called:", {
            originalPetType: petType,
            lowercasePetType: this.petType
        })

        // Khởi tạo tốc độ giảm cleanliness ngẫu nhiên cho mỗi pet (0.7x - 1.3x)
        this.cleanlinessDecreaseMultiplier = 0.7 + Math.random() * 0.6

        // Khởi tạo tốc độ giảm happiness ngẫu nhiên cho mỗi pet (0.7x - 1.3x)
        this.happinessDecreaseMultiplier = 0.7 + Math.random() * 0.6
    }

    create(x: number, y?: number) {
        // Nếu x/y chưa truyền vào, thử lấy từ _pendingX/_pendingY (random từ PetManager)
        let finalX = x
        let finalY = y
        if (typeof finalX !== "number" && (this as unknown as { _pendingX?: number })._pendingX)
            finalX = (this as unknown as { _pendingX: number })._pendingX
        if (typeof finalY !== "number" && (this as unknown as { _pendingY?: number })._pendingY)
            finalY = (this as unknown as { _pendingY: number })._pendingY
        // If still not available, fallback to default
        if (typeof finalX !== "number") finalX = 400
        const cameraHeight = this.scene.cameras.main.height
        const camWidth = this.scene.cameras.main.width
        if (typeof finalY !== "number") {
            finalY = GamePositioning.getPetY(cameraHeight)
        }

        // Clamp positions to ensure pets are within camera bounds
        // Use same boundary logic as MovementSystem for consistency
        const petBounds = GamePositioning.getPetBoundaries(camWidth)
        finalX = Phaser.Math.Clamp(finalX, petBounds.minX, petBounds.maxX)
        // Clamp Y to be within camera bounds (pets should be in lower 80% of screen)
        const minY = cameraHeight * 0.2
        const maxY = cameraHeight * 0.95
        finalY = Phaser.Math.Clamp(finalY, minY, maxY)

        this.groundY = finalY // Store ground line position

        // Get appropriate texture based on pet type
        const textureKey = this.getTextureKey("walk")
        const frameKey = this.getFrameKey("walk", 0)

        console.debug("🎨 [Pet] Creating sprite:", {
            petType: this.petType,
            textureKey,
            frameKey,
            textureExists: this.scene.textures.exists(textureKey)
        })

        this.sprite = this.scene.add.sprite(finalX, finalY, textureKey, frameKey)
        this.sprite.setScale(GAME_LAYOUT.PET_SCALE)

        const cameraWidth = this.scene.cameras.main.width
        const responsiveScale = GamePositioning.getResponsivePetScale(cameraWidth)
        this.sprite.setScale(responsiveScale)

        // Set origin to bottom center so pets stand ON the ground line
        this.sprite.setOrigin(0.5, 1)

        // Fine-tune Y position to ensure pets stick to bottom without being cut off
        this.sprite.y = finalY - 2

        // Make pet clickable to switch active pet
        this.sprite.setInteractive()
        this.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            console.log(`🖱️ Pet clicked with button: ${pointer.button}`)

            if (pointer.button === 0) {
                // Left click
                if (this.onPetClicked) {
                    this.onPetClicked()
                }
            } else if (pointer.button === 2) {
                // Right click
                if (this.onPetRightClicked) {
                    this.onPetRightClicked()
                }
            }
        })

        // Add hover effect for better UX
        this.sprite.on("pointerover", () => {
            // Only apply hover effect if not already active (no tint)
            if (this.sprite.tintTopLeft === 0xffffff) {
                this.sprite.setTint(0xdddddd) // Slightly darker when hovered
            }
        })

        this.sprite.on("pointerout", () => {
            // Only clear tint if it's the hover tint, not the active tint
            if (this.sprite.tintTopLeft === 0xdddddd) {
                this.sprite.clearTint()
            }
        })

        this.updateActivity()
    }

    /**
     * Get texture key based on pet type and activity
     */
    private getTextureKey(activity: string): string {
        switch (this.petType) {
            case "keonedog":
                return `keonedog-${activity}`
            case "ghost":
                return `ghost-${activity}`
            case "zombie":
                return `zombie-${activity}`
            case "bird":
                return `bird-${activity}`
            case "chog":
            default:
                return `chog-${activity}`
        }
    }

    /**
     * Get frame key based on pet type, activity and frame number
     */
    private getFrameKey(activity: string, frameNumber: number): string {
        const petPrefix =
            this.petType === "keonedog"
                ? "keonedog"
                : this.petType === "ghost"
                  ? "ghost"
                  : this.petType === "zombie"
                    ? "zombie"
                    : this.petType === "bird"
                      ? "bird"
                      : "chog"

        // Handle different frame naming conventions
        if (this.petType === "zombie") {
            // Zombie uses different extensions: .gif for idle, .aseprite for others
            const extension = activity === "idle" ? "gif" : "aseprite"
            return `${petPrefix}_${activity} ${frameNumber}.${extension}`
        }

        return `${petPrefix}_${activity} ${frameNumber}.aseprite`
    }

    /**
     * Get animation key based on pet type and activity
     */
    private getAnimationKey(activity: string): string {
        switch (this.petType) {
            case "keonedog":
                return `keonedog-${activity}`
            case "ghost":
                return `ghost-${activity}`
            case "zombie":
                return `zombie-${activity}`
            case "bird":
                return `bird-${activity}`
            case "chog":
            default:
                return `chog-${activity}`
        }
    }

    createAnimations() {
        // Create animations for current pet type
        this.createWalkAnimation()
        this.createSleepAnimations()
        this.createPlayAnimations()
        this.createChewAnimations()
        this.createIdleAnimation()
        this.createIdlePlayAnimation()
        this.createHappyAnimation()
        this.createShitAnimation()
    }

    private createWalkAnimation() {
        const textureKey = this.getTextureKey("walk")
        const animationKey = this.getAnimationKey("walk")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 6 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 8
                break
            case "keonedog":
                maxFrames = 5
                break
            case "ghost":
                maxFrames = 4
                break
            case "zombie":
                maxFrames = 6 // Zombie walk has 6 frames
                break
            case "bird":
                maxFrames = 4
                break
            default:
                maxFrames = 6
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("walk", i)
            })
        }

        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 8,
            repeat: -1
        })
    }

    private createSleepAnimations() {
        const textureKey = this.getTextureKey("sleep")
        const animationKey = this.getAnimationKey("sleep")
        const loopAnimationKey = this.getAnimationKey("sleep-loop")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 6 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 6
                break
            case "keonedog":
                maxFrames = 4
                break
            case "ghost":
                maxFrames = 4 // Ghost uses same frame count as KeoneDog
                break
            case "zombie":
                maxFrames = 4 // Zombie sleep has 4 frames
                break
            case "bird":
                maxFrames = 4
                break
            default:
                maxFrames = 6
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("sleep", i)
            })
        }

        // Sleep animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 3,
            repeat: 14
        })

        // Sleep loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 3,
            repeat: -1
        })
    }

    private createPlayAnimations() {
        const textureKey = this.getTextureKey("play")
        const animationKey = this.getAnimationKey("play")
        const loopAnimationKey = this.getAnimationKey("play-loop")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 15 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 19
                break
            case "keonedog":
                maxFrames = 14
                break
            case "ghost":
                maxFrames = 20
                break
            case "zombie":
                maxFrames = 10
                break
            case "bird":
                maxFrames = 20
                break
            default:
                maxFrames = 15
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("play", i) // Note: using "idleplay" for frame naming
            })
        }

        // Play animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 9,
            repeat: 1
        })

        // Play loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 10,
            repeat: -1
        })
    }

    private createChewAnimations() {
        const textureKey = this.getTextureKey("chew")
        const animationKey = this.getAnimationKey("chew")
        const loopAnimationKey = this.getAnimationKey("chew-loop")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 6 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 10
                break
            case "keonedog":
                maxFrames = 11
                break
            case "ghost":
                maxFrames = 11 // Ghost uses same frame count as KeoneDog
                break
            case "zombie":
                maxFrames = 8 // Zombie chew has 8 frames
                break
            case "bird":
                maxFrames = 6
                break
            default:
                maxFrames = 6
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("chew", i)
            })
        }

        // Chew animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 6,
            repeat: 1
        })

        // Chew loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 6,
            repeat: -1
        })
    }

    private createIdleAnimation() {
        const textureKey = this.getTextureKey("idle")
        const animationKey = this.getAnimationKey("idle")
        const loopAnimationKey = this.getAnimationKey("idle-loop")

        // Use first frame of walk as idle
        const frames = []
        let maxFrames = 4 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 4
                break
            case "keonedog":
                maxFrames = 4
                break
            case "ghost":
                maxFrames = 4
                break
            case "zombie":
                maxFrames = 4
                break
            case "bird":
                maxFrames = 4
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("idle", i)
            })
        }

        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 6,
            repeat: 1
        })

        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 6,
            repeat: -1
        })
    }

    private createIdlePlayAnimation() {
        const textureKey = this.getTextureKey("idleplay")
        const animationKey = this.getAnimationKey("idleplay")
        const loopAnimationKey = this.getAnimationKey("idleplay-loop")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 15 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 15
                break
            case "keonedog":
                maxFrames = 10
                break
            case "ghost":
                maxFrames = 16
                break
            case "zombie":
                maxFrames = 9
                break
            case "bird":
                maxFrames = 7
                break
            default:
                maxFrames = 15
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("idleplay", i)
            })
        }

        // IdlePlay animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 10,
            repeat: 1
        })

        // IdlePlay loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 10,
            repeat: -1
        })
    }

    private createHappyAnimation() {
        const textureKey = this.getTextureKey("happy")
        const animationKey = this.getAnimationKey("happy")
        const loopAnimationKey = this.getAnimationKey("happy-loop")

        const frames = []
        // All pet types have 4 frames for happy
        const maxFrames = 4

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("happy", i)
            })
        }

        // Happy animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 8,
            repeat: 1
        })

        // Happy loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 8,
            repeat: -1
        })
    }

    private createShitAnimation() {
        const textureKey = this.getTextureKey("shit")
        const animationKey = this.getAnimationKey("shit")
        const loopAnimationKey = this.getAnimationKey("shit-loop")

        const frames = []
        // Get correct frame count for each pet type
        let maxFrames = 14 // Default fallback
        switch (this.petType) {
            case "chog":
                maxFrames = 14
                break
            case "keonedog":
                maxFrames = 14
                break
            case "ghost":
                maxFrames = 22
                break
            case "zombie":
                maxFrames = 18
                break
            case "bird":
                maxFrames = 12
                break
            default:
                maxFrames = 14
        }

        for (let i = 0; i < maxFrames; i++) {
            frames.push({
                key: textureKey,
                frame: this.getFrameKey("shit", i)
            })
        }

        // Shit animation (plays once)
        this.scene.anims.create({
            key: animationKey,
            frames,
            frameRate: 8,
            repeat: 1
        })

        // Shit loop animation (repeats forever)
        this.scene.anims.create({
            key: loopAnimationKey,
            frames,
            frameRate: 8,
            repeat: -1
        })
    }

    updateActivity() {
        switch (this.currentActivity) {
            case "walk":
                this.sprite.play(this.getAnimationKey("walk"))
                this.isMoving = true
                break
            case "play":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("play-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("play"))
                }
                this.isMoving = false
                break
            case "sleep":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("sleep-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("sleep"))
                }
                this.isMoving = false
                break
            case "idleplay":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("idleplay-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("idleplay"))
                }
                this.isMoving = false
                break
            case "chew":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("chew-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("chew"))
                }
                this.isMoving = false
                break
            case "happy":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("happy-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("happy"))
                }
                this.isMoving = false
                break
            case "shit":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("shit-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("shit"))
                }
                this.isMoving = false
                break
            case "idle":
                if (this.isUserControlled) {
                    this.sprite.play(this.getAnimationKey("idle-loop"))
                } else {
                    this.sprite.play(this.getAnimationKey("idle"))
                }
                this.isMoving = false
                break
            default:
                this.sprite.play(this.getAnimationKey("walk"))
                this.isMoving = true
        }
    }

    setActivity(newActivity: string) {
        this.currentActivity = newActivity
        this.updateActivity()
    }

    setUserActivity(newActivity: string) {
        this.currentActivity = newActivity
        this.updateActivity()

        if (newActivity === "walk") {
            this.isUserControlled = false
        } else {
            this.isUserControlled = true
        }
    }

    startChasing(x: number, y: number) {
        this.isChasing = true
        this.chaseTarget = { x, y }
        this.isUserControlled = true
        this.setActivity("walk")
    }

    stopChasing() {
        this.isChasing = false
        this.chaseTarget = null

        // Reset edge detection to allow proper boundary flipping
        this.lastEdgeHit = ""

        // Notify PetManager about stopping chase
        if (this.onStopChasing) {
            this.onStopChasing()
        }

        // Ensure pet returns to proper walk animation when stopping chase
        if (this.currentActivity === "walk") {
            this.setActivity("walk")
        }
    }

    // Ensure pet stays on ground line
    enforceGroundLine(): void {
        const correctGroundY = GamePositioning.getPetY(this.scene.cameras.main.height)
        if (this.sprite && this.sprite.y !== correctGroundY) {
            this.sprite.y = correctGroundY
            this.groundY = correctGroundY // Update stored ground Y
        }
    }

    // Set callback for when pet is clicked
    setOnPetClicked(callback: () => void): void {
        this.onPetClicked = callback
    }

    // Set callback for when pet is right-clicked
    setOnPetRightClicked(callback: () => void): void {
        this.onPetRightClicked = callback
    }

    // Cleanup method
    destroy(): void {
        if (this.sprite) {
            this.sprite.destroy()
        }
        console.log("🧹 Pet destroyed")
    }
}
