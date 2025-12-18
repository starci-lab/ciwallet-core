import { ScrollArea } from "@/nomas/components/shadcn/scroll-area"
import type { BackgroundItem } from "@/nomas/game/configs/gameConfig"
import type { ShopCategoryKey, ShopItemTypeKey } from "@/types/game"
import { isBackgroundType } from "../../utils/shopKeys"
import type { ShopItem } from "@/types/game"
import { ShopItemCard } from "../ShopItemCard"

interface ShopGridProps {
    items: ShopItem[]
    category: ShopCategoryKey
    isItemOwned: (item: ShopItem) => boolean
    detectItemType: (item: ShopItem) => ShopItemTypeKey
    getBackgroundKey: (item: BackgroundItem) => string
    getItemImageUrl: (category: ShopCategoryKey, item: ShopItem) => string
    currentBackgroundId: string | null | undefined
    pendingBackgroundPurchaseId: string | null
    onItemClick: (item: ShopItem, isBackground: boolean, owned: boolean) => void
}

/**
 * ShopGrid - Items grid with empty state
 */
export const ShopGrid = ({
    items,
    category,
    isItemOwned,
    detectItemType,
    getBackgroundKey,
    getItemImageUrl,
    currentBackgroundId,
    pendingBackgroundPurchaseId,
    onItemClick
}: ShopGridProps) => {
    return (
        <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-card-dark-4 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-xl font-semibold text mb-2">Items Coming Soon!</h3>
                        <p className="text-muted">New items will be added regularly</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {items.map((item) => {
                            const owned = isItemOwned(item)
                            const itemType = detectItemType(item)
                            const isBackground = isBackgroundType(itemType)
                            const isPendingBackground =
                                isBackground && pendingBackgroundPurchaseId === getBackgroundKey(item as BackgroundItem)
                            const isActiveBackground =
                                isBackground &&
                                owned &&
                                currentBackgroundId === getBackgroundKey(item as BackgroundItem)
                            return (
                                <ShopItemCard
                                    key={item.id}
                                    category={category}
                                    item={item}
                                    owned={owned}
                                    isBackground={isBackground}
                                    isPendingBackground={isPendingBackground}
                                    isActiveBackground={isActiveBackground}
                                    imageSrc={getItemImageUrl(category, item)}
                                    onClick={() => {
                                        if (isPendingBackground) return
                                        onItemClick(item, isBackground, owned)
                                    }}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}
