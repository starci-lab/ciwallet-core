import { createContext, useEffect, type PropsWithChildren } from "react"
import { useColyseusCore } from "./useColyseus"
import { useColyseusConnection } from "./useColyseusConnection"
import { colyseusService } from "@/nomas/game/colyseus/ColyseusService"
import { envConfig } from "@/nomas/env"
import { ReactEventName } from "@/nomas/game"
import { reactBus } from "@/nomas/game/events/react/bus"
import { eventBus } from "@/nomas/game/event-bus"
import { ColyseusActionEvents } from "@/nomas/game/colyseus/events"
import { useColyseusMessages } from "./useColyseusMessages"
import { useColyseusReduxSync } from "./useColyseusReduxSync"

export interface ColyseusContextType {
    useColyseus: ReturnType<typeof useColyseusCore>
    // New hooks for connection management
    connection: ReturnType<typeof useColyseusConnection>
}

export const ColyseusContext = createContext<ColyseusContextType | undefined>(undefined)

export const ColyseusProvider = ({ children }: PropsWithChildren) => {
    // Old hook for backward compatibility
    const useColyseus = useColyseusCore()

    // New hooks for Colyseus connection
    const connection = useColyseusConnection()
    const { room } = connection

    // Set up message handling
    useColyseusMessages(room)

    // Set up Redux synchronization
    useColyseusReduxSync()

    // Initialize ColyseusService when provider mounts
    useEffect(() => {
        colyseusService.initialize()

        // Cleanup on unmount
        return () => {
            colyseusService.destroy()
        }
    }, [])

    // Connect room to ColyseusService when room changes
    useEffect(() => {
        if (room) {
            colyseusService.setRoom(room)

            // Request player state AFTER room is set in ColyseusService
            // Server will respond with player_state_sync message containing tokens, inventory, etc.
            // useColyseusReduxSync hook will handle updating Redux store
            eventBus.emit(ColyseusActionEvents.RequestPlayerState, {})
        }
    }, [room])

    // Connect only after game is loaded (sync with useGameLoaded state)
    // This ensures PetManager and GameScene are ready before connecting
    useEffect(() => {
        const handleGameLoaded = () => {
            const backendUrl = envConfig().colyseus.endpoint

            // Only connect if not already connected
            if (!connection.isConnected) {
                connection.connect(backendUrl).catch((error) => {
                    console.error("[ColyseusProvider] Connect failed:", error)
                })
            }
        }

        // Listen for game loaded event
        reactBus.on(ReactEventName.GameLoaded, handleGameLoaded)

        // Cleanup
        return () => {
            reactBus.off(ReactEventName.GameLoaded, handleGameLoaded)
        }
    }, [connection])

    return <ColyseusContext.Provider value={{ useColyseus, connection }}>{children}</ColyseusContext.Provider>
}
