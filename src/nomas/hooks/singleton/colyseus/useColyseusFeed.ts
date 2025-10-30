import { useEffect } from "react"
import { useColyseus } from "./useColyseus"
import { EventNames, eventBus } from "@/nomas/game/event-bus"
export const useColyseusFeed = () => {
    const { joinOrCreateRoom } = useColyseus()

    useEffect(() => {
        const handleTileSelected = (payload: {
            tile: { row: number; col: number }
            worldX: number
            worldY: number
        }) => {
            joinOrCreateRoom("single_player", {
                name: "Pet Game",
                addressWallet: addressWallet,
            })
        }
        eventBus.on(EventNames.TileSelected, handleTileSelected)
        return () => {
            eventBus.off(EventNames.TileSelected, handleTileSelected)
        }
    }, [])

    return {
        joinOrCreateRoom,
    }
}