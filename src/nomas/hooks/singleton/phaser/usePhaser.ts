import { useCallback, useContext, useRef, useState, useEffect } from "react"
import { PhaserContext } from "./PhaserProvider"
import { phaserConfig, CONTAINER_ID } from "@/nomas/game"
import { GameScene } from "@/nomas/game/GameScene"
import { SceneName } from "@/nomas/game/types"
// import { CONTAINER_ID } from "@/nomas/content"

export const usePhaserCore = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const [game, setGame] = useState<Phaser.Game | null>(null)
    const [scene, setScene] = useState<GameScene | null>(null)

    const createGame = useCallback(() => {
        const parent = document.getElementById(CONTAINER_ID) as HTMLDivElement
        if (!parent) {
            throw new Error("Container not found")
        }

        // Don't create if already exists and game is still running
        if (gameRef.current && gameRef.current.isBooted) {
            console.log("⚠️ Game already exists, skipping creation")
            return
        }

        const phaserGame = new Phaser.Game(phaserConfig(parent))
        gameRef.current = phaserGame
        setGame(phaserGame)

        console.log("✅ Phaser game created, waiting for scene to boot...")

        // Wait for game to boot and scene to be ready
        const checkScene = () => {
            if (phaserGame && phaserGame.isBooted && phaserGame.scene) {
                try {
                    const gameScene = phaserGame.scene.getScene(
                        SceneName.Gameplay
                    ) as GameScene | null
                    if (gameScene && gameScene.scene && gameScene.scene.key) {
                        // Validate it's actually a GameScene
                        const candidateScene = gameScene as unknown as GameScene
                        if (
                            candidateScene &&
              typeof candidateScene.getPetManager === "function"
                        ) {
                            setScene(candidateScene)
                            console.log("✅ GameScene detected from usePhaser hook")
                            return true
                        }
                    }
                } catch {
                    // Scene not ready yet
                }
            }
            return false
        }

        // Try immediately
        if (checkScene()) {
            return
        }

        // Poll for scene until it's ready (max 10 seconds)
        let attempts = 0
        const maxAttempts = 100 // 10 seconds at 100ms intervals
        const intervalId = setInterval(() => {
            attempts++
            if (checkScene() || attempts >= maxAttempts) {
                clearInterval(intervalId)
                if (attempts >= maxAttempts) {
                    console.warn("⚠️ GameScene not detected after 10 seconds")
                }
            }
        }, 100)
    }, [])

    // Also poll for scene changes when game is available
    useEffect(() => {
        if (!game || scene) return // Skip if no game or already have scene

        const checkScene = () => {
            if (game.isBooted && game.scene) {
                try {
                    const gameScene = game.scene.getScene(
                        SceneName.Gameplay
                    ) as GameScene | null
                    if (gameScene && gameScene.scene && gameScene.scene.key) {
                        const candidateScene = gameScene as unknown as GameScene
                        if (
                            candidateScene &&
              typeof candidateScene.getPetManager === "function"
                        ) {
                            setScene(candidateScene)
                            return true
                        }
                    }
                } catch {
                    // Continue
                }
            }
            return false
        }

        // Try immediately
        if (checkScene()) return

        // Poll every 200ms
        const intervalId = setInterval(() => {
            if (checkScene()) {
                clearInterval(intervalId)
            }
        }, 200)

        return () => clearInterval(intervalId)
    }, [game, scene])

    return {
        createGame,
        game,
        scene,
        getGame: () => gameRef.current, // Direct access to current ref value
    }
}

export const usePhaser = () => {
    const context = useContext(PhaserContext)
    if (!context) {
        throw new Error("usePhaser must be used within a PhaserProvider")
    }
    return context.usePhaser
}
