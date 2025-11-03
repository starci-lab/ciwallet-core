import { useIconClickContentBus } from "./useIconClickContentBus"
import { EventEmitter } from "eventemitter3"

export const useContentBus = (contentEventBus?: EventEmitter) => {
    useIconClickContentBus(contentEventBus)
}