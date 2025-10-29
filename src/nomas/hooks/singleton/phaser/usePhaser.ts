import { useCallback, useContext, useRef } from "react"
import { PhaserContext } from "./PhaserProvider"
import { phaserConfig, CONTAINER_ID } from "@/nomas/game"

export const usePhaserCore = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const createGame = useCallback(() => {
        const parent = document.getElementById(CONTAINER_ID) as HTMLDivElement
        if (!parent) {
            throw new Error("Container not found")
        }
        gameRef.current = new Phaser.Game(phaserConfig(parent))
    }, [])
    return {
        createGame,
        game: gameRef.current,
    }
}

export const usePhaser = () => {
    const context = useContext(PhaserContext)
    if (!context) {
        throw new Error("usePhaser must be used within a PhaserProvider")
    }
    return context.usePhaser
}