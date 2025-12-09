import { ColyseusMessageEvents, type PlayerStateSyncMessage } from "@/nomas/game/colyseus/events"
import { setNomToken } from "@/nomas/redux"
import type { MessageHandlerConfig } from "./types"

/**
 * Player state response format with success flag
 */
interface PlayerStateResponseFormat {
    success: boolean
    data: {
        player: {
            tokens?: number
            [key: string]: unknown
        }
        [key: string]: unknown
    }
}

/**
 * Nested data format
 */
interface NestedDataFormat {
    data: {
        tokens?: number
        player?: {
            tokens?: number
            [key: string]: unknown
        }
        [key: string]: unknown
    }
}

/**
 * Union type covering all possible message formats
 */
type PlayerStateMessageFormat = PlayerStateSyncMessage | PlayerStateResponseFormat | NestedDataFormat

/**
 * Type guard to check if message has success flag
 */
function isPlayerStateResponseFormat(message: unknown): message is PlayerStateResponseFormat {
    return (
        typeof message === "object" &&
        message !== null &&
        "success" in message &&
        "data" in message &&
        typeof (message as Record<string, unknown>).data === "object" &&
        (message as Record<string, unknown>).data !== null &&
        "player" in ((message as Record<string, unknown>).data as Record<string, unknown>)
    )
}

/**
 * Type guard to check if message has nested data
 */
function hasNestedData(message: unknown): message is NestedDataFormat {
    return (
        typeof message === "object" &&
        message !== null &&
        "data" in message &&
        typeof (message as Record<string, unknown>).data === "object" &&
        (message as Record<string, unknown>).data !== null
    )
}

/**
 * Extract tokens from player state message
 * Supports multiple message formats:
 * - {success: true, data: {player: {tokens: ...}}}
 * - {data: {tokens: ...}}
 * - {tokens: ...}
 */
const extractPlayerTokens = (message: PlayerStateMessageFormat): number | undefined => {
    // Handle player-state-response format: {success: true, data: {player: {tokens: ...}, pets: [...]}}
    if (isPlayerStateResponseFormat(message)) {
        return message.data.player.tokens
    }

    // Support nested shape under `data` or flat message (player_state_sync format)
    if (hasNestedData(message)) {
        const data = message.data as Record<string, unknown>
        // Check if tokens is directly in data
        if (typeof data.tokens === "number") {
            return data.tokens
        }
        // Check if tokens is in data.player
        if (typeof data.player === "object" && data.player !== null) {
            const player = data.player as Record<string, unknown>
            if (typeof player.tokens === "number") {
                return player.tokens
            }
        }
    }

    // Flat message format (PlayerStateSyncMessage)
    if (typeof message === "object" && message !== null) {
        const flatMessage = message as Record<string, unknown>
        if (typeof flatMessage.tokens === "number") {
            return flatMessage.tokens
        }
    }

    return undefined
}

/**
 * Handle player state synchronization
 * Handles both player_state_sync and player-state-response messages
 */
export const playerStateHandler: MessageHandlerConfig<PlayerStateSyncMessage> = {
    event: ColyseusMessageEvents.PlayerStateSync,
    handler: (message, dispatch) => {
        const tokens = extractPlayerTokens(message)

        if (tokens !== undefined) {
            dispatch(setNomToken(tokens))
        } else {
            console.warn("⚠️ [useColyseusReduxSync] No tokens found in message:", message)
        }
    }
}
