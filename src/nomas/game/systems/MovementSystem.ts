import { Pet } from "../entities/Pet"
import { GamePositioning, GAME_MECHANICS } from "@/nomas/game/constants"
export class MovementSystem {
    private pet: Pet
    private scene: Phaser.Scene

    constructor(pet: Pet, scene: Phaser.Scene) {
        this.pet = pet
        this.scene = scene
    }

    update(): {
        reachedTarget: boolean
        targetX?: number
        targetY?: number
    } | void {
        // Ensure pet stays on ground line
        this.pet.enforceGroundLine()

        // Handle chasing food
        if (this.pet.isChasing && this.pet.chaseTarget) {
            return this.handleChasing()
        } else if (!this.pet.isUserControlled) {
            if (this.pet.currentActivity === "walk") {
                this.handleWalkCycle()
            }
        }

        if (this.pet.isMoving && this.pet.currentActivity === "walk") {
            this.handleMovement()
        }
    }

    private handleChasing() {
        if (!this.pet.chaseTarget) return

        const targetX = this.pet.chaseTarget.x
        const targetY = this.pet.chaseTarget.y
        const distance = Phaser.Math.Distance.Between(this.pet.sprite.x, this.pet.sprite.y, targetX, targetY)

        // If the target is close enough, stop chasing
        if (distance < GAME_MECHANICS.CHASE_DISTANCE) {
            return { reachedTarget: true, targetX, targetY }
        }

        // Move towards food - ONLY along the X axis to keep ground line
        const deltaX = targetX - this.pet.sprite.x

        // Only move along the X axis, keep Y (ground line)
        if (Math.abs(deltaX) > 5) {
            // Dead zone to avoid jittering
            const newX = this.pet.sprite.x + Math.sign(deltaX) * this.pet.speed * (1 / 60)

            // Apply boundary constraints even when chasing
            const petBounds = GamePositioning.getPetBoundaries(this.scene.cameras.main.width)

            // Clamp position to stay within bounds
            this.pet.sprite.x = Phaser.Math.Clamp(newX, petBounds.minX, petBounds.maxX)

            // Flip sprite in the direction of movement
            if (deltaX > 0) {
                this.pet.sprite.setFlipX(false)
                this.pet.direction = 1
            } else {
                this.pet.sprite.setFlipX(true)
                this.pet.direction = -1
            }
        }

        return { reachedTarget: false }
    }

    private handleWalkCycle() {
        const petBounds = GamePositioning.getPetBoundaries(this.scene.cameras.main.width)

        if (this.pet.sprite.x >= petBounds.maxX && this.pet.direction === 1 && this.pet.lastEdgeHit !== "right") {
            this.pet.direction = -1
            this.pet.sprite.setFlipX(true)
            this.pet.lastEdgeHit = "right"
        } else if (
            this.pet.sprite.x <= petBounds.minX &&
            this.pet.direction === -1 &&
            this.pet.lastEdgeHit !== "left"
        ) {
            this.pet.direction = 1
            this.pet.sprite.setFlipX(false)
            this.pet.lastEdgeHit = "left"
        }

        // Reset lastEdgeHit when pet moves away from edges
        if (this.pet.sprite.x > petBounds.minX + 10 && this.pet.sprite.x < petBounds.maxX - 10) {
            if (this.pet.lastEdgeHit !== "") {
                this.pet.lastEdgeHit = ""
            }
        }
    }

    private handleMovement() {
        const newX = this.pet.sprite.x + this.pet.direction * this.pet.speed * (1 / 60)

        // Apply boundary constraints
        const petBounds = GamePositioning.getPetBoundaries(this.scene.cameras.main.width)

        // Clamp position to stay within bounds
        this.pet.sprite.x = Phaser.Math.Clamp(newX, petBounds.minX, petBounds.maxX)
    }
}
