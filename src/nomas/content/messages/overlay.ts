import browser from "webextension-polyfill"
import { type ExtensionMessage, BackgroundMessageType } from "./types"

// Track overlay visibility state
let isOverlayVisible = false

// Reference to the Shadow DOM where the overlay lives
let shadowRef: ShadowRoot | null = null
/**
 * Sets the shadow root reference so other modules (like message listener)
 * can control elements inside the overlay.
 */
export const setShadowRoot = (shadow: ShadowRoot): void => {
    shadowRef = shadow
}
/**
 * Initializes a listener for background messages sent via chrome.runtime.
 * Used to toggle the overlay when user clicks the extension icon or triggers commands.
 */
export const initOverlayMessageListener = (): void => {
    browser.runtime.onMessage.addListener((
        message: unknown,
        _: browser.Runtime.MessageSender,
        sendResponse: (response?: unknown) => void
    ) => {
        const _message = message as ExtensionMessage
        if (_message.type === BackgroundMessageType.TOGGLE_OVERLAY) {
            toggleOverlay()
            sendResponse({ success: true })
        }
        return true // keeps the message channel open for async responses
    })
}
/**
 * Toggles the overlay panel's visibility by adding/removing the "visible" CSS class.
 * Does nothing if the shadow DOM or panel element is not found.
 */
const toggleOverlay = (): void => {
    if (!shadowRef) return

    const panel = shadowRef.querySelector<HTMLElement>(".wallet-container")
    if (!panel) return

    isOverlayVisible = !isOverlayVisible
    panel.classList.toggle("visible", isOverlayVisible)
}