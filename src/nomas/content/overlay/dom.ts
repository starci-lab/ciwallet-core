// src/content/overlay/overlay.dom.ts

/**
 * Creates the fixed container element that will host the Shadow DOM.
 * This container is appended directly to <body> of the host page.
 */
export const createOverlayContainer = (): HTMLDivElement => {
    const container = document.createElement("div")
    container.id = "nomas-wallet-overlay-container"
  
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
  
/**
   * Injects base CSS styles for the overlay UI into the Shadow DOM.
   * This styles the fixed panel that slides in/out on the right side.
   *
   * You can also replace this with Tailwind or a CSS-in-JS solution later.
   */
export const injectStyles = (shadow: ShadowRoot): void => {
    const style = document.createElement("style")
    style.textContent = `
      .wallet-overlay {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        pointer-events: none;
        background: transparent;
      }
  
      .wallet-container {
        width: 500px;
        height: calc(100vh - 40px);
        margin: 20px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
        pointer-events: auto;
        background: white;
        border-radius: 12px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateX(520px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.25);
      }
  
      .wallet-container.visible {
        transform: translateX(0);
      }
    `
    shadow.appendChild(style)
}