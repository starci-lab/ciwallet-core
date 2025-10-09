import { initMessageListener } from "./messages"
import { initInjection } from "./overlay"

console.log("[Nomas] Content script initializing...")
if (!window.nomasWalletInjected) {
    window.nomasWalletInjected = true

    // Inject overlay UI
    initInjection()

    // Listen to background messages
    initMessageListener()

    console.log("[Nomas] Content script initialized ✅")
}