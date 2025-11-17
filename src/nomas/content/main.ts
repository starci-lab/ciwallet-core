import { initInjection } from "./overlay"
import { initListeners } from "./listeners"

console.log("[Nomas] Content script initializing...")
if (!window.nomasWalletInjected) {
    window.nomasWalletInjected = true

    // Inject overlay UI
    initInjection()

    // Initialize listeners
    initListeners()

    console.log("[Nomas] Content script initialized ✅")
}
