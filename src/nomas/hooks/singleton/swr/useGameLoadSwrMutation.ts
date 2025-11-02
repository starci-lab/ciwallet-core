import useSWRMutation from "swr/mutation"
import { useGameAuthenticationSwrMutationCore } from "./useGameAuthenticationSwrMutation"
import { usePhaser } from "../phaser"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"

export const useGameLoadSwrMutationCore = () => {
    const gameAuthenticationSwrMutation = useGameAuthenticationSwrMutationCore()
    const { createGame } = usePhaser()
    // ColyseusProvider listens to ReactEventName.GameLoaded event and connects automatically

    const swrMutation = useSWRMutation("GAME_LOAD", async () => {
        await gameAuthenticationSwrMutation.trigger()
        // Create game - this will emit ReactEventName.GameLoaded when ready
        // ColyseusProvider will then connect automatically
        createGame()
    })
    return swrMutation
}

export const useGameLoadSwrMutation = () => {
    const context = useContext(SwrProviderContext)
    if (!context) {
        throw new Error("useGameLoadSwrMutation must be used within a SwrProvider")
    }
    return context.gameLoadSwrMutation
}
