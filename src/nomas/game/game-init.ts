import { gameConfigManager } from "./configs/gameConfig"

// Initialize game configuration when the game starts
export async function initializeGame() {
    try {
        // Load game configuration (tries API first, falls back to local)
        await gameConfigManager.loadConfig()

        return true
    } catch (error) {
        console.error("Game initialization failed:", error)
        return false
    }
}
