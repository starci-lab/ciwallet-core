import type { ShopCategoryKey } from "@/types/game"
import type { ShopItem } from "@/types/game"

interface ShopItemCardProps {
    category: ShopCategoryKey
    item: ShopItem
    owned: boolean
    isBackground: boolean
    isPendingBackground: boolean
    isActiveBackground: boolean
    imageSrc: string
    onClick: () => void
}

/**
 * ShopItemCard - Individual shop item card component
 */
export const ShopItemCard = ({
    category,
    item,
    owned,
    isBackground,
    isPendingBackground,
    isActiveBackground,
    imageSrc,
    onClick
}: ShopItemCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`group bg-shop-item border rounded-[14px] px-1.5 py-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-shop-item hover:bg-shop-item-hover transition-all duration-200 ${
                isActiveBackground ? "border-accent-purple border-2" : "border-shop-item"
            }`}
            style={{
                opacity: isPendingBackground ? 0.7 : owned && !isActiveBackground ? 0.5 : 1,
                cursor: isPendingBackground ? "progress" : owned && !isBackground ? "not-allowed" : "pointer"
            }}
        >
            {/* Item Image */}
            <div className="w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center">
                <img
                    src={imageSrc}
                    className="w-full h-full object-cover object-[0%_50%]"
                    style={{
                        // For cleaning sprite sheets, show only leftmost section
                        maxWidth: category === "clean" ? "calc(100% * 6)" : "100%",
                        transform: category === "clean" ? "translateX(0)" : "none"
                    }}
                />
            </div>

            {/* Item Info */}
            <div className="font-semibold text-[13px] text-muted text-center">{item.name}</div>
            <div className="text-xs text-muted flex items-center gap-1">
                <span>{Number(item.cost_nom ?? 0).toLocaleString()} NOM</span>
                {isActiveBackground && <span className="text-[10px] text-accent-purple font-semibold">(Active)</span>}
                {isPendingBackground && (
                    <span className="text-[10px] text-accent-amber font-semibold">(Purchasing...)</span>
                )}
                {owned && !isActiveBackground && <span className="text-[10px] text-green-300">(Owned)</span>}
            </div>
        </div>
    )
}

