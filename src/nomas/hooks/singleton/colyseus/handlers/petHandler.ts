import {
    ColyseusMessageEvents,
    type PetsStateSyncMessage,
    type BuyPetResponseMessage
} from "@/nomas/game/colyseus/events"
import type { PurchaseCleanedPetResponse } from "@/nomas/game/systems"
import { setNomToken } from "@/nomas/redux"
import type { MessageHandlerConfig } from "./types"

/**
 * Handle pets state synchronization
 * Note: We don't update Redux directly for pets - we emit events for PetManager to handle
 */
export const petsStateHandler: MessageHandlerConfig<PetsStateSyncMessage> = {
    event: ColyseusMessageEvents.PetsStateSync,
    handler: (_message: PetsStateSyncMessage) => {
        // Pets sync is handled by PetManager via event listeners
        // This hook just logs it - the actual sync happens in Phaser layer
    }
}

/**
 * Flat format for buy pet response (backward compatibility)
 */
interface BuyPetResponseFlatFormat {
    tokens: number
    [key: string]: unknown
}

/**
 * Union type supporting both nested and flat formats
 */
type BuyPetResponseMessageFormat = BuyPetResponseMessage | BuyPetResponseFlatFormat

/**
 * Type guard to check if message has flat format
 */
function isFlatFormat(message: BuyPetResponseMessageFormat): message is BuyPetResponseFlatFormat {
    return (
        typeof message === "object" &&
        message !== null &&
        "tokens" in message &&
        typeof (message as Record<string, unknown>).tokens === "number" &&
        !("data" in message)
    )
}

/**
 * Extract tokens from buy pet response
 * Supports both nested and flat formats
 */
const extractBuyPetTokens = (message: BuyPetResponseMessageFormat): number | undefined => {
    // Handle nested format: {success: true, data: {tokens: ...}}
    if ("data" in message && typeof message.data === "object" && message.data !== null) {
        const data = message.data as Record<string, unknown>
        if (typeof data.tokens === "number") {
            return data.tokens
        }
    }

    // Flat format: direct access (backward compatibility)
    if (isFlatFormat(message)) {
        return message.tokens
    }

    return undefined
}

/**
 * Handle buy_pet_response to sync tokens
 * Supports both flat and nested message formats
 * Note: Pet sync is handled by PetManager via event listeners
 */
export const buyPetHandler: MessageHandlerConfig<BuyPetResponseMessageFormat> = {
    event: ColyseusMessageEvents.BuyPetResponse,
    handler: (message, dispatch) => {
        const tokens = extractBuyPetTokens(message)

        if (tokens !== undefined) {
            dispatch(setNomToken(tokens))
        } else {
            console.warn("⚠️ No tokens found", message)
        }

        // Note: Pet sync and toast notifications are handled by PetManager
        // which listens to the same BuyPetResponse event
    }
}

/**
 * Handle cleaned_pet_response to sync tokens
 * Supports both flat and nested message formats
 */
export const cleanedPetHandler: MessageHandlerConfig<PurchaseCleanedPetResponse> = {
    event: ColyseusMessageEvents.CleanedPetResponse,
    handler: (message, dispatch) => {
        if (message.data?.remainingTokens !== undefined) {
            dispatch(setNomToken(message.data.remainingTokens))
        }
    }
}
