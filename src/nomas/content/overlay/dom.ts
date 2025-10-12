// src/content/overlay/overlay.dom.ts
import tailwindStyles from "../../global.css"
/**
 * Creates the fixed container element that will host the Shadow DOM.
 * This container is appended directly to <body> of the host page.
 */
export const CONTAINER_ID = "nomas-wallet-overlay-container"
export const createOverlayContainer = (): HTMLDivElement => {
    const container = document.createElement("div")
    container.id = CONTAINER_ID
    Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "2147483647", // Max z-index to stay above everything
        pointerEvents: "none", // let clicks pass through except inside overlay
        backgroundColor: "transparent",
    })
  
    document.body.appendChild(container)
    return container
}
  
/**
   * Attaches and returns a Shadow DOM to the container.
   * We use 'open' mode so we can inspect it in DevTools if needed.
   */
export const createShadowRoot = (container: HTMLDivElement): ShadowRoot => {
    return container.attachShadow({ mode: "open" })
}

export const injectTailwindToShadow = (shadow: ShadowRoot) => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(tailwindStyles.toString())
    shadow.adoptedStyleSheets = [sheet]
}
