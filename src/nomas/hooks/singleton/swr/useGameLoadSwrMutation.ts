import useSWRMutation from "swr/mutation"
import { useGameAuthenticationSwrMutationCore } from "./useGameAuthenticationSwrMutation"
import { usePhaser } from "../phaser"
import { useColyseus } from "../colyseus"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"

export const useGameLoadSwrMutationCore = () => {
    const gameAuthenticationSwrMutation = useGameAuthenticationSwrMutationCore()
    const { createGame } = usePhaser()
    const { joinOrCreateRoom } = useColyseus()
    
    const swrMutation = useSWRMutation(
        "GAME_LOAD",
        async () => {
            await gameAuthenticationSwrMutation.trigger()
            await joinOrCreateRoom("single-player")
            createGame()
        }
    )
    return swrMutation
}

export const useGameLoadSwrMutation = () => {
    const context = useContext(SwrProviderContext)
    if (!context) {
        throw new Error(
            "useGameLoadSwrMutation must be used within a SwrProvider"
        )
    }
    return context.gameLoadSwrMutation
}