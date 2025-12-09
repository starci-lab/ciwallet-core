import { ColyseusMessageEvents } from "@/nomas/game/colyseus/events"
import type { PurchaseResponse } from "@/nomas/game/systems"
import { setNomToken } from "@/nomas/redux"
import type { MessageHandlerConfig } from "./types"

/**
 * Handle purchase responses to sync tokens
 * Supports both flat and nested message formats
 */
export const purchaseHandler: MessageHandlerConfig<PurchaseResponse> = {
    event: ColyseusMessageEvents.PurchaseResponse,
    handler: (message, dispatch) => {
        if (message.newTokenBalance !== undefined) {
            dispatch(setNomToken(message.newTokenBalance))
        } else {
            console.warn("⚠️ No tokens found", message)
        }
    }
}

/**
 * Handle purchase_item_response to sync tokens
 * Supports both flat and nested message formats
 */
export const purchaseItemHandler: MessageHandlerConfig<PurchaseResponse> = {
    event: ColyseusMessageEvents.PurchaseItemResponse,
    handler: (message, dispatch) => {
        if (message.newTokenBalance !== undefined) {
            dispatch(setNomToken(message.newTokenBalance))
        }
    }
}

