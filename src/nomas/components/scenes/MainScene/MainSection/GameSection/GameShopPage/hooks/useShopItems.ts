import { useMemo } from "react"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import type { ShopCategoryKey } from "@/types/game"
import type { ShopItem } from "@/types/game"

/**
 * Hook to get shop items for a given category
 */
export const useShopItems = (category: ShopCategoryKey): ShopItem[] => {
    return useMemo<ShopItem[]>(() => {
        switch (category) {
        case "food":
            return Object.values(gameConfigManager.getFoodItems())
        case "toy":
            return Object.values(gameConfigManager.getToyItems())
        case "clean":
            return Object.values(gameConfigManager.getCleaningItems())
        case "furniture":
            return Object.values(gameConfigManager.getFurnitureItems())
        case "pets":
            return Object.values(gameConfigManager.getPetItems())
        case "backgrounds":
            return Object.values(gameConfigManager.getBackgroundItems())
        default:
            return []
        }
    }, [category])
}
