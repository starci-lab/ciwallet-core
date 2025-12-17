import type { AppDispatch } from "@/nomas/redux"
import { ColyseusMessageEvents } from "@/nomas/game/colyseus/events"

/**
 * Message handler configuration
 * Each handler is responsible for processing a specific Colyseus message event
 */
export interface MessageHandlerConfig<T = unknown> {
    event: ColyseusMessageEvents
    handler: (message: T, dispatch: AppDispatch) => void
}
