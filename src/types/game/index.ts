import type {
    FoodItem,
    ToyItem,
    PetItem,
    BackgroundItem,
    CleaningItem,
    FurnitureItem
} from "@/nomas/game/configs/gameConfig"

export type ShopCategoryKey = "pets" | "food" | "toy" | "clean" | "furniture" | "backgrounds"

export type ShopItemTypeKey = "food" | "toy" | "clean" | "pets" | "background" | "backgrounds" | "furniture"

/**
 * Union type for all shop items
 */
export type ShopItem = FoodItem | ToyItem | PetItem | BackgroundItem | CleaningItem | FurnitureItem

/**
 * Shop tabs configuration
 */
export const SHOP_TABS: Array<{ k: ShopCategoryKey; t: string }> = [
    { k: "pets", t: "Pets" },
    { k: "food", t: "Food" },
    { k: "toy", t: "Toys" },
    { k: "clean", t: "Cleaning" },
    { k: "furniture", t: "Furniture" },
    { k: "backgrounds", t: "Backgrounds" }
]
