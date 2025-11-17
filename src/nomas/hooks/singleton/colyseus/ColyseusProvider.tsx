import React, { createContext, useEffect, type PropsWithChildren } from "react"
import { useColyseusCore } from "./useColyseus"
import {
    useColyseusConnection,
    useColyseusMessages,
    useColyseusReduxSync,
} from "@/nomas/hooks/colyseus"
import { colyseusService } from "@/nomas/game/colyseus/ColyseusService"
import { envConfig } from "@/nomas/env"
import { ReactEventName } from "@/nomas/game"
import { reactBus } from "@/nomas/game/events/react/bus"
import { eventBus } from "@/nomas/game/event-bus"
import { ColyseusActionEvents } from "@/nomas/game/colyseus/events"

export interface ColyseusContextType {
  useColyseus: ReturnType<typeof useColyseusCore>
  // New hooks for connection management
  connection: ReturnType<typeof useColyseusConnection>
}

export const ColyseusContext = createContext<ColyseusContextType | undefined>(
    undefined
)

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
        console.log("[ColyseusProvider] Initializing ColyseusService...")
        colyseusService.initialize()

        // Cleanup on unmount
        return () => {
            console.log("[ColyseusProvider] Cleaning up ColyseusService...")
            colyseusService.destroy()
        }
    }, [])

    // Connect room to ColyseusService when room changes
    useEffect(() => {
        if (room) {
            console.log(
                "[ColyseusProvider] Setting room in ColyseusService:",
                room.roomId
            )
            colyseusService.setRoom(room)

            // Request player state AFTER room is set in ColyseusService
            // Server will respond with player_state_sync message containing tokens, inventory, etc.
            // useColyseusReduxSync hook will handle updating Redux store
            console.log(
                "[ColyseusProvider] Requesting player state from server (room is ready)..."
            )
            eventBus.emit(ColyseusActionEvents.RequestPlayerState, {})
            console.log("[ColyseusProvider] Player state request event emitted")
        } else {
            console.log("[ColyseusProvider] Room is null, clearing ColyseusService")
            // Room will be cleared by ColyseusService when disconnected event fires
        }
    }, [room])

    // Connect only after game is loaded (sync with useGameLoaded state)
    // This ensures PetManager and GameScene are ready before connecting
    useEffect(() => {
        const handleGameLoaded = () => {
            const backendUrl = envConfig().colyseus.endpoint
            console.log(
                "[ColyseusProvider] Game loaded, connecting to Colyseus:",
                backendUrl
            )

            // Only connect if not already connected
            if (!connection.isConnected) {
                connection.connect(backendUrl).catch((error) => {
                    console.error("[ColyseusProvider] Connect failed:", error)
                })
            } else {
                console.log(
                    "[ColyseusProvider] Already connected, skipping auto-connect"
                )
            }
        }

        // Listen for game loaded event
        reactBus.on(ReactEventName.GameLoaded, handleGameLoaded)

        // Cleanup
        return () => {
            reactBus.off(ReactEventName.GameLoaded, handleGameLoaded)
        }
    }, [connection])

    return (
        <ColyseusContext.Provider value={{ useColyseus, connection }}>
            {children}
        </ColyseusContext.Provider>
    )
}
