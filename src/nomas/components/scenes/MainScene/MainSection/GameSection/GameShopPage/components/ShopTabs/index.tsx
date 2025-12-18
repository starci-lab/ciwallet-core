import { useEffect, useRef } from "react"
import { ScrollArea } from "@/nomas/components/shadcn/scroll-area"
import type { ShopCategoryKey } from "@/types/game"
import { SHOP_TABS } from "@/types/game"

interface ShopTabsProps {
    category: ShopCategoryKey
    setCategory: (category: ShopCategoryKey) => void
}

/**
 * ShopTabs - Category tabs with auto-scroll behavior
 */
export const ShopTabs = ({ category, setCategory }: ShopTabsProps) => {
    const tabsContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const wrap = tabsContainerRef.current
        if (!wrap) return
        const activeBtn = wrap.querySelector<HTMLButtonElement>(`button[data-key="${category}"]`)
        if (!activeBtn) return
        activeBtn.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        })
    }, [category])

    return (
        <div className="bg-card-dark-3 px-4 py-3 border-b border-muted shrink-0">
            <ScrollArea className="w-full">
                <div ref={tabsContainerRef} className="relative flex gap-2 overflow-x-auto">
                    {SHOP_TABS.map((tab) => (
                        <button
                            key={tab.k}
                            data-key={tab.k}
                            onClick={() => setCategory(tab.k)}
                            className={`px-3 py-1.5 rounded-[30px] text-sm font-medium whitespace-nowrap shrink-0
                           transition-all duration-200 ${
                        category === tab.k
                            ? "bg-accent-purple text"
                            : "bg-transparent text-muted hover:text-muted-hover"
                        }`}
                        >
                            {tab.t}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

