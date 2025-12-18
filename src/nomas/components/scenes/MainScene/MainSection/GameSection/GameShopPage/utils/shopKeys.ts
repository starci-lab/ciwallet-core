import type { BackgroundItem } from "@/nomas/game/configs/gameConfig"
import type { ShopItemTypeKey } from "@/types/game"

/**
 * Normalize a value to a lowercase string key, or undefined if invalid
 */
export const normalizeKey = (v: unknown): string | undefined => {
    if (v === null || v === undefined) return undefined
    const s = String(v).trim()
    if (!s) return undefined
    return s.toLowerCase()
}

/**
 * Check if an item type is a background type
 */
export const isBackgroundType = (t: ShopItemTypeKey): boolean => {
    return t === "background" || t === "backgrounds"
}

/**
 * Get stable identifier for backgrounds across UI / server inventory / assets
 */
export const getBackgroundKey = (item: BackgroundItem): string => {
    return String(item.displayId ?? item.id ?? item.texture ?? item.name)
}

/**
 * Get Phaser texture key for background item
 * BackgroundItem.texture contains displayId (e.g., "city", "sky")
 * Texture keys in Phaser follow pattern: "city-bg", "sky-bg", or "game-background"
 */
export const getBackgroundTextureKey = (item: BackgroundItem): string => {
    const textureLc = normalizeKey(item.texture)
    if (textureLc) {
        return textureLc === "game" ? "game-background" : `${textureLc}-bg`
    }

    const baseName = normalizeKey(item.id ?? item.name) ?? ""
    if (baseName === "game" || baseName.includes("game")) {
        return "game-background"
    }
    return `${baseName.replace(/-bg$/, "")}-bg`
}

