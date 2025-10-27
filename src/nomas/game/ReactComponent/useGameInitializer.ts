import { useEffect, useRef } from "react"
import Phaser from "phaser"
import { useGameAuthenticationSwr } from "@/nomas/hooks"
import { CONTAINER_ID, getConfig } from "../configs/phaser-config"

export const useGameInitializer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const gameAuthenticationSwr = useGameAuthenticationSwr()
    
    useEffect(() => {
        if (!gameAuthenticationSwr.data) {
            return
        }
        // retrieve the parent element
        const parent = document.getElementById(CONTAINER_ID) as HTMLDivElement
        if (!parent) {
            return
        }
        // create the game
        gameRef.current = new Phaser.Game(getConfig(parent))
    }, [gameAuthenticationSwr.data])
}
