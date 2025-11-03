// content/messages/listeners/onOverlayClickHandler.ts
import { ExtensionMessageType, type ExtensionMessage } from "@/types"
import * as browser from "webextension-polyfill"
import { onIconClickHandler } from "./onIconClickHandler"

export const initListeners = () => {
    browser.runtime.onMessage.addListener((message, _, sendResponse) => {
        const _message = message as ExtensionMessage
        if (_message.type === ExtensionMessageType.ToggleOverlay) {
            onIconClickHandler()
            sendResponse({ success: true })
        } else {
            sendResponse({ success: false })
        }
        return true
    })
}