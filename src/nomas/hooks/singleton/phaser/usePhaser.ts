import { useCallback, useContext, useRef } from "react"
import { PhaserContext } from "./PhaserProvider"
import { phaserConfig, CONTAINER_ID } from "@/nomas/game"
import { GameScene } from "@/nomas/game/GameScene"
import { useEvents } from "./events"

export const usePhaserCore = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const sceneRef = useRef<GameScene | null>(null)
    // we create the game only once
    const createGame = useCallback(async () => {
        let container: HTMLDivElement
        let phaserGame: Phaser.Game
        if (import.meta.env.VITE_APP_ENV === "EXTENSION") {
            const host = document.getElementById(
                "nomas-wallet-overlay-container"
            ) as HTMLDivElement
            if (!host) {
                throw new Error("Host not found")
            }
            const shadowRoot = host.shadowRoot
            if (!shadowRoot) {
                throw new Error("Shadow root not found")
            }
            container = shadowRoot.getElementById(CONTAINER_ID) as HTMLDivElement
            if (!container) {
                throw new Error("Container not found")
            }
            phaserGame = new Phaser.Game(phaserConfig(container))
        } else {
            container = document.getElementById(CONTAINER_ID) as HTMLDivElement
            if (!container) {
                throw new Error("Container not found")
            }
            phaserGame = new Phaser.Game(phaserConfig(container))
        }
        gameRef.current = phaserGame
    }, [])
    // we load all the events here
    useEvents()
    return {
        game: gameRef.current,
        scene: sceneRef.current,
        createGame,
    }
}

export const usePhaser = () => {
    const context = useContext(PhaserContext)
    if (!context) {
        throw new Error("usePhaser must be used within a PhaserProvider")
    }
    return context.usePhaser
}
