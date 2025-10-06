// src/content/overlay/special-web-apps.ts

export interface SpecialWebAppConfig {
    hostnames: Array<string>         // which sites this config applies to
    injectDelay?: number        // custom delay before injecting overlay
    marginRightCalculator?: () => number // optional function to tweak overlay margin
  }
  
// Example: Twitter (x.com) loads slowly → needs extra delay
const twitterConfig: SpecialWebAppConfig = {
    hostnames: ["x.com", "twitter.com"],
    injectDelay: 1500,
    marginRightCalculator: () => {
        const sidebar = document.querySelector("[data-testid=\"sidebarColumn\"]")
        if (sidebar) {
            const rect = sidebar.getBoundingClientRect()
            return window.innerWidth - (rect.left + rect.width)
        }
        return 20
    }
}
  
// Example: Facebook — has dynamic sidebar but loads fast
const facebookConfig: SpecialWebAppConfig = {
    hostnames: ["facebook.com"],
    injectDelay: 800,
    marginRightCalculator: () => 16
}
  
// Example: Gmail — very SPA, but layout is stable
const gmailConfig: SpecialWebAppConfig = {
    hostnames: ["mail.google.com"],
    injectDelay: 1200
}
  
// Example: Default for everything else
const defaultConfig: SpecialWebAppConfig = {
    hostnames: ["*"],
    injectDelay: 100,
    marginRightCalculator: () => 20
}
  
// Export list
export const specialWebApps: SpecialWebAppConfig[] = [
    twitterConfig,
    facebookConfig,
    gmailConfig,
    defaultConfig
]
  
/**
   * Finds a matching config for the current hostname.
   */
export const getSpecialWebAppConfig = (hostname: string): SpecialWebAppConfig => {
    return (
        specialWebApps.find(cfg =>
            cfg.hostnames.some(h => h === hostname || h === "*")
        ) || defaultConfig
    )
}