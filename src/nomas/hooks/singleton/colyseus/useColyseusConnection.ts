/**
 * React Hook for Colyseus Connection Management
 *
 * Manages connection lifecycle, state, and emits events for connection status.
 * This hook handles:
 * - Connecting to Colyseus server
 * - Attaching existing rooms
 * - Disconnecting
 * - Connection state management
 * - Error handling
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { Client, Room } from "colyseus.js"
import { eventBus } from "@/nomas/game/event-bus"
import type { GameRoomState } from "@/nomas/game/schema/ChatSchema"
import { store } from "@/nomas/redux"
import {
    ColyseusConnectionEvents,
    type ColyseusConnectedEvent,
    type ColyseusDisconnectedEvent,
    type ColyseusErrorEvent
} from "@/nomas/game/colyseus/events"
import { AuthDB } from "@/nomas/utils/idb"

/**
 * Connection state interface
 */
export interface ColyseusConnectionState {
    room: Room<GameRoomState> | null
    isConnected: boolean
    roomId: string | null
    sessionId: string | null
    error: Error | null
}

/**
 * Hook return type
 */
export interface UseColyseusConnectionReturn extends ColyseusConnectionState {
    connect: (backendUrl: string) => Promise<void>
    attachRoom: (room: Room<GameRoomState>) => void
    disconnect: () => void
    sendMessage: (type: string, data: unknown) => void
}

/**
 * React hook for managing Colyseus connection
 *
 * @example
 * ```tsx
 * const { connect, isConnected, room, error } = useColyseusConnection()
 *
 * useEffect(() => {
 *   connect("ws://localhost:2567")
 * }, [])
 * ```
 */
export const useColyseusConnection = (): UseColyseusConnectionReturn => {
    // Store room in ref (doesn't trigger re-renders)
    const roomRef = useRef<Room<GameRoomState> | null>(null)
    const clientRef = useRef<Client | null>(null)

    // Connection state (triggers re-renders)
    const [roomId, setRoomId] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    /**
     * Connect to Colyseus server
     */
    const connect = useCallback(async (backendUrl: string) => {
        // Reset error state
        setError(null)

        try {
            // Get addressWallet from Redux store (only for connection, not user state)
            // User state (tokens, inventory, etc.) will be fetched from server after connection
            const userState = store.getState().stateless.user
            const addressWallet = userState.addressWallet
            // const [message, signature, publicKey] = await Promise.all([
            //     AuthDB.getMessage(),
            //     AuthDB.getSignature(),
            //     AuthDB.getPublicKey()
            // ])

            // if (!addressWallet || !message || !signature || !publicKey) {
            //     throw new Error("Message, signature, or public key not found - cannot connect to Colyseus")
            // }

            // const requestColyseusEphemeralJwtInput: RequestColyseusEphemeralJwtInput = {
            //     publicKey: publicKey,
            //     accountAddress: addressWallet,
            //     signature: signature,
            //     message: message,
            //     platform: "evm"
            // }

            // const requestColyseusEphemeralJwtResult = await mutationEphemeralColyseusFn({
            //     request: requestColyseusEphemeralJwtInput
            // })

            // const jwt = requestColyseusEphemeralJwtResult.data?.requestColyseusEphemeralJwt?.data?.jwt
            // if (!jwt) {
            //     throw new Error("JWT not found - cannot connect to Colyseus")
            // }

            // console.log("🔄 [useColyseusConnection] Connecting with addressWallet:", addressWallet)

            // Create client
            const client = new Client(backendUrl)
            clientRef.current = client

            const accessToken = await AuthDB.getAccessToken()
            client.auth.token = accessToken
            // Connect to room
            const room = await client.joinOrCreate<GameRoomState>("game", {
                userAddress: addressWallet
            })

            // Update refs and state
            roomRef.current = room
            setRoomId(room.roomId)
            setSessionId(room.sessionId)
            setIsConnected(true)
            setError(null)

            // Emit connected event first
            const connectedEvent: ColyseusConnectedEvent = {
                roomId: room.roomId,
                sessionId: room.sessionId,
                roomName: room.state?.roomName
            }
            eventBus.emit(ColyseusConnectionEvents.Connected, connectedEvent)

            // Request player state from server AFTER room is set in ColyseusService
            // ColyseusProvider will set the room, then we can safely request player state
            // We'll handle this via the connected event listener in ColyseusProvider
            // or wait for room to be available in ColyseusService
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err) || "Unknown error")
            console.error("[useColyseusConnection] Connection failed:", error)
            setError(error)
            setIsConnected(false)
            setRoomId(null)
            setSessionId(null)
            roomRef.current = null

            // Emit error event
            const errorEvent: ColyseusErrorEvent = {
                code: 0, // Colyseus doesn't always provide error codes
                message: error.message
            }
            eventBus.emit(ColyseusConnectionEvents.Error, errorEvent)
        }
    }, [])

    /**
     * Attach an existing room (from React hook use-colyseus)
     */
    const attachRoom = useCallback((room: Room<GameRoomState>) => {
        // Avoid re-attaching if same room
        if (roomRef.current === room) {
            return
        }

        // Update refs and state
        roomRef.current = room
        setRoomId(room.roomId)
        setSessionId(room.sessionId)
        setIsConnected(true)
        setError(null)

        // Emit connected event
        const connectedEvent: ColyseusConnectedEvent = {
            roomId: room.roomId,
            sessionId: room.sessionId,
            roomName: room.state?.roomName
        }
        eventBus.emit(ColyseusConnectionEvents.Connected, connectedEvent)
    }, [])

    /**
     * Disconnect from room
     */
    const disconnect = useCallback(() => {
        const room = roomRef.current

        if (room) {
            // Leave room
            room.leave()

            // Emit disconnected event
            const disconnectedEvent: ColyseusDisconnectedEvent = {
                code: 1000 // Normal closure
            }
            eventBus.emit(ColyseusConnectionEvents.Disconnected, disconnectedEvent)
        }

        // Cleanup
        roomRef.current = null
        clientRef.current = null
        setRoomId(null)
        setSessionId(null)
        setIsConnected(false)
    }, [])

    /**
     * Send message to server
     */
    const sendMessage = useCallback(
        (type: string, data: unknown) => {
            const room = roomRef.current

            if (!room) {
                console.warn("[useColyseusConnection] Cannot send message - room is null")
                return
            }

            if (!isConnected) {
                console.warn("[useColyseusConnection] Cannot send message - not connected")
                return
            }

            try {
                room.send(type, data)
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err) || "Failed to send message")
                console.error("[useColyseusConnection] Failed to send message:", error)
                setError(error)
            }
        },
        [isConnected]
    )

    /**
     * Setup room event listeners
     */
    useEffect(() => {
        const room = roomRef.current
        if (!room) return

        // Handle room errors (message is optional in Colyseus.js)
        const handleRoomError = (code: number, message?: string) => {
            const errorMessage = message || `Room error code: ${code}`
            console.error("[useColyseusConnection] Room error:", code, errorMessage)
            const errorEvent: ColyseusErrorEvent = { code, message: errorMessage }
            eventBus.emit(ColyseusConnectionEvents.Error, errorEvent)
            setError(new Error(`Room error: ${errorMessage} (${code})`))
        }

        // Handle room leave
        const handleLeave = (code: number) => {
            const disconnectedEvent: ColyseusDisconnectedEvent = { code }
            eventBus.emit(ColyseusConnectionEvents.Disconnected, disconnectedEvent)

            // Update state
            roomRef.current = null
            setRoomId(null)
            setSessionId(null)
            setIsConnected(false)
        }

        room.onError(handleRoomError)
        room.onLeave(handleLeave)

        // Cleanup
        // Note: Colyseus.js doesn't provide offError/offLeave methods
        // Event listeners are cleaned up automatically when room is closed
        return () => {
            // Cleanup is handled automatically by Colyseus.js
        }
    }, [roomId]) // Re-run when room changes

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            const room = roomRef.current
            if (room) {
                room.leave()
            }
        }
    }, [])

    return {
        room: roomRef.current,
        isConnected,
        roomId,
        sessionId,
        error,
        connect,
        attachRoom,
        disconnect,
        sendMessage
    }
}
