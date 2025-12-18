/* eslint-disable indent */
import { useCallback, useMemo } from "react"
import type { ShopItemTypeKey } from "@/types/game"
import type {
    FoodItem,
    ToyItem,
    PetItem,
    BackgroundItem,
    CleaningItem,
    FurnitureItem
} from "@/nomas/game/configs/gameConfig"
import { normalizeKey } from "../utils/shopKeys"
import type { ShopItem } from "@/types/game"

/**
 * Detect item type from shop item
 */
const detectItemType = (shopItem: ShopItem): ShopItemTypeKey => {
    // Prefer explicit store item type when available
    const storeType = (shopItem as { type?: string }).type
    switch (storeType) {
        case "food":
            return "food"
        case "toy":
            return "toy"
        case "clean":
            return "clean"
        case "furniture":
            return "furniture"
        case "background":
            return "background"
        case "pet":
            return "pets"
        default:
            break
    }

    // Fallback heuristics based on effect fields
    if ((shopItem as { hungerRestore?: number }).hungerRestore !== undefined) {
        return "food"
    }
    if ((shopItem as { happinessRestore?: number }).happinessRestore !== undefined) {
        return "toy"
    }
    if ((shopItem as { cleanlinessRestore?: number }).cleanlinessRestore !== undefined) {
        return "clean"
    }
    return "furniture"
}

/**
 * Get purchase item IDs for ownership matching
 */
export const getPurchaseItemIds = (shopItem: ShopItem): string[] => {
    const type = detectItemType(shopItem)
    const nameLc = normalizeKey(shopItem.name)
    switch (type) {
        case "food":
            return [
                String((shopItem as FoodItem).displayId ?? (shopItem as FoodItem).id ?? shopItem.name),
                nameLc
            ].filter(Boolean) as string[]
        case "toy":
            return [(shopItem as ToyItem).id ?? normalizeKey((shopItem as ToyItem).displayId) ?? shopItem.name, nameLc]
                .filter(Boolean)
                .map(String)
        case "clean":
            return [
                (shopItem as CleaningItem).id ?? normalizeKey((shopItem as CleaningItem).displayId) ?? shopItem.name,
                nameLc
            ]
                .filter(Boolean)
                .map(String)
        case "furniture":
            return [String((shopItem as FurnitureItem).id ?? shopItem.name), nameLc].filter(Boolean) as string[]
        case "background":
        case "backgrounds":
            return [
                String((shopItem as BackgroundItem).displayId ?? (shopItem as BackgroundItem).id ?? shopItem.name),
                String((shopItem as BackgroundItem).id ?? ""),
                normalizeKey((shopItem as BackgroundItem).texture),
                nameLc
            ].filter(Boolean) as string[]
        case "pets":
            return [String((shopItem as PetItem).displayId ?? shopItem.name), nameLc].filter(Boolean) as string[]
        default:
            return [String((shopItem as { id?: string }).id ?? shopItem.name), nameLc].filter(Boolean) as string[]
    }
}

/**
 * Hook to check shop item ownership
 */
export const useShopOwnership = (
    ownedItems: Array<{ itemId: string; itemType: string; itemName?: string }>,
    optimisticOwnedBackgroundKeys: Set<string>
) => {
    const ownedByType = useMemo(() => {
        const map: Record<string, Set<string>> = {}
        ownedItems.forEach((item) => {
            const typeKey = item.itemType.toLowerCase()
            const altKeys =
                typeKey === "backgrounds"
                    ? ["background", "backgrounds"]
                    : typeKey === "background"
                      ? ["background", "backgrounds"]
                      : [typeKey]

            const idValue = String(item.itemId).toLowerCase()
            const nameValue = item.itemName ? item.itemName.toLowerCase() : undefined

            altKeys.forEach((k) => {
                if (!map[k]) {
                    map[k] = new Set()
                }
                map[k].add(idValue)
                if (nameValue) {
                    map[k].add(nameValue)
                }
            })
        })
        return map
    }, [ownedItems])

    const isItemOwned = useCallback(
        (shopItem: ShopItem): boolean => {
            const type = detectItemType(shopItem)
            const ids = getPurchaseItemIds(shopItem)

            // Backgrounds may be keyed as "background" in inventory while tab key is "backgrounds"
            const typeKeys =
                type === "backgrounds"
                    ? ["background", "backgrounds"]
                    : type === "background"
                      ? ["background", "backgrounds"]
                      : [type]

            // Background UX: allow optimistic ownership (avoid stale sync overwriting right after purchase)
            if (typeKeys.includes("background") || typeKeys.includes("backgrounds")) {
                const optimisticHit = ids.some((id) => optimisticOwnedBackgroundKeys.has(String(id).toLowerCase()))
                if (optimisticHit) return true
            }

            return typeKeys.some((t) => {
                const set = ownedByType[t]
                if (!set) return false
                return ids.some((id) => set.has(String(id).toLowerCase()))
            })
        },
        [optimisticOwnedBackgroundKeys, ownedByType]
    )

    return {
        isItemOwned,
        detectItemType
    }
}
