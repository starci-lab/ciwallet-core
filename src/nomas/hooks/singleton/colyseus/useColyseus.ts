import { useCallback, useContext, useRef } from "react"
import { Client, Room } from "colyseus.js"
import { ColyseusContext } from "./ColyseusProvider"
import { envConfig } from "@/nomas/env"
import type { GameRoomState } from "./schemas"
import pRetry from "p-retry"

export const useColyseusCore = () => {
  // to get the client instance
  const clientRef = useRef<Client>(new Client(envConfig().colyseus.endpoint))
  // ref to the current room
  const roomRef = useRef<Room<GameRoomState> | null>(null)
  // method to allow user to join or create a room
  const joinOrCreateRoom = useCallback(
    async (roomName: string, options: Record<string, unknown> = {}) => {
      try {
        const room = await pRetry(
          async () => {
            return await clientRef.current?.joinOrCreate(roomName, options)
            // return await clientRef.current.join(roomName, {
            //   name: "Pet Game",
            //   addressWallet: store.getState().stateless.user.addressWallet,
            // })
          },
          {
            retries: 3,
          }
        )
        // if room is found, set the room ref
        if (room) {
          roomRef.current = room
        }
      } catch (error) {
        // todo: handle error by showing a toast notification
        console.error("Error joining or creating room:", error)
      }
    },
    []
  )
  return {
    client: clientRef.current,
    joinOrCreateRoom,
  }
}

export const useColyseus = () => {
  const context = useContext(ColyseusContext)
  if (!context) {
    throw new Error("Colyseus client not found")
  }
  return context.useColyseus
}
