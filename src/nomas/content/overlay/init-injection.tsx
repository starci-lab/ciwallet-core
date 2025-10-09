import React from "react"
import { createRoot, type Root } from "react-dom/client"
import { createOverlayContainer, createShadowRoot, injectTailwindToShadow } from "./dom"
import { getSpecialWebAppConfig } from "./special-web-apps"
import { OverlayRoot } from "./OverlayRoot" // React component for the overlay UI

// Shadow DOM reference, used to isolate the overlay UI from the host page styles
let shadowRoot: ShadowRoot

// React root instance — keeps track so we can unmount or re-render later if needed
let reactRoot: Root | null = null

/**
 * Initializes the overlay injection logic.
 *
 * This function is the entry point for injecting the wallet overlay UI
 * into any webpage. It:
 *  - Checks for special per-website configuration (e.g. Twitter)
 *  - Waits an appropriate delay before injecting (for slow-loading SPAs)
 *  - Creates the container div and attaches a Shadow DOM
 *  - Injects styles into the shadow DOM to style the overlay panel
 *  - Mounts the React component tree inside the shadow DOM
 */
export const initInjection = () => {
    // Retrieve configuration (injectDelay, margins, etc.) based on the current hostname
    const { injectDelay } = getSpecialWebAppConfig(window.location.hostname)

    setTimeout(() => {
        // If body is not yet available, retry later
        if (!document.body) return initInjection()
        console.log("[Nomas] HTML5 Body is available")
        // 1. Create a fixed container in the DOM for the overlay
        const container = createOverlayContainer()
        console.log("[Nomas] Container created")
        // 2. Attach a Shadow DOM to this container to isolate styles & markup
        shadowRoot = createShadowRoot(container)
        console.log("[Nomas] Shadow root created")
        injectTailwindToShadow(shadowRoot)
        console.log("[Nomas] Tailwind injected")
        // 4. Mount the React application inside the shadow DOM
        mountReact(shadowRoot)
        console.log("[Nomas] React mounted")
    }, injectDelay) // Delay ensures SPA pages like Twitter/Gmail finish rendering
}

/**
 * Mounts the React overlay UI into the Shadow DOM.
 *
 * This function creates an empty <div> inside the shadow DOM,
 * then uses React 18's createRoot() to render the OverlayRoot component tree.
 */
export const mountReact = (shadow: ShadowRoot) => {
    // Create an empty container inside the shadow DOM
    const rootEl = document.createElement("div")
    shadow.appendChild(rootEl)
    // Initialize React root and render the overlay UI into it
    reactRoot = createRoot(rootEl)
    reactRoot.render(<OverlayRoot />)
}