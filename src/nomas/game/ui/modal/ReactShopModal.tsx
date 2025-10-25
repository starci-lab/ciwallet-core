import { useEffect, useRef, useState } from "react"
import { GameScene } from "@/nomas/game/GameScene"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import type {
    FoodItem,
    ToyItem,
    PetItem,
    BackgroundItem,
    CleaningItem,
    FurnitureItem,
} from "@/nomas/game/configs/gameConfig"
import { setNomToken, useAppSelector } from "@/nomas/redux"
import { useDispatch } from "react-redux"
import { getShopItemAssetPath } from "@/nomas/utils/assetPath"
import createResizedCursor from "@/nomas/utils/resizeImage"
import { ScrollArea } from "@/nomas/components/shadcn/scroll-area"
import { NomasButton, NomasImage, NomasInput } from "@/nomas/components"
import { assetsConfig } from "@/nomas/resources"

type ShopItem =
  | FoodItem
  | ToyItem
  | PetItem
  | BackgroundItem
  | CleaningItem
  | FurnitureItem

export function ReactShopModal({
    isOpen,
    onClose,
    scene,
}: {
  isOpen: boolean
  onClose: () => void
  scene: GameScene
}) {
    const assets = assetsConfig().game
    const [category, setCategory] = useState<string>("food")
    const [items, setItems] = useState<ShopItem[]>([])
    const balance = useAppSelector((state) => state.stateless.user.nomToken)

    const getItemImageSrc = (cat: string, shopItem: ShopItem): string => {
        const effectiveCategory =
      cat === "items" ? detectItemType(shopItem) : (cat as string)
        return getShopItemAssetPath(effectiveCategory, shopItem)
    }

    const detectItemType = (
        shopItem: ShopItem
    ):
    | "food"
    | "toy"
    | "clean"
    | "pets"
    | "background"
    | "backgrounds"
    | "furniture" => {
        if ((shopItem as { hungerRestore?: number }).hungerRestore !== undefined) {
            return "food"
        }
        if (
            (shopItem as { happinessRestore?: number }).happinessRestore !== undefined
        ) {
            return "toy"
        }
        if (
            (shopItem as { cleanlinessRestore?: number }).cleanlinessRestore !==
      undefined
        ) {
            return "clean"
        }
        if ((shopItem as { theme?: string }).theme !== undefined) {
            return "background"
        }
        if ((shopItem as { species?: string }).species !== undefined) {
            return "pets"
        }
        return "furniture"
    }

    const userDispatch = useDispatch()
    useEffect(() => {
        userDispatch(setNomToken(balance))
    }, [balance])

    // Tabs slider indicator (horizontal scrollable tabs)
    const tabsContainerRef = useRef<HTMLDivElement | null>(null)
    const [indicator, setIndicator] = useState<{ left: number; width: number }>({
        left: 0,
        width: 0,
    })

    const recalcIndicator = () => {
        const wrap = tabsContainerRef.current
        if (!wrap) return
        const activeBtn = wrap.querySelector<HTMLButtonElement>(
            `button[data-key="${category}"]`
        )
        if (!activeBtn) return
        const left = activeBtn.offsetLeft - wrap.scrollLeft
        const width = activeBtn.offsetWidth
        setIndicator({ left, width })
    }

    const scrollActiveIntoView = () => {
        const wrap = tabsContainerRef.current
        if (!wrap) return
        const activeBtn = wrap.querySelector<HTMLButtonElement>(
            `button[data-key="${category}"]`
        )
        if (!activeBtn) return
        activeBtn.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        })
    }

    useEffect(() => {
        recalcIndicator()
        scrollActiveIntoView()
    }, [category])

    useEffect(() => {
        const onResize = () => recalcIndicator()
        window.addEventListener("resize", onResize)
        const el = tabsContainerRef.current
        const onScroll = () => recalcIndicator()
        el?.addEventListener("scroll", onScroll)
        return () => {
            window.removeEventListener("resize", onResize)
            el?.removeEventListener("scroll", onScroll)
        }
    }, [])
    console.log("items in react", items)
    useEffect(() => {
        switch (category) {
        case "food":
            setItems(Object.values(gameConfigManager.getFoodItems()))
            break
        case "toy":
            setItems(Object.values(gameConfigManager.getToyItems()))
            break
        case "clean":
            setItems(Object.values(gameConfigManager.getCleaningItems()))
            break
        case "furniture":
            setItems(Object.values(gameConfigManager.getFurnitureItems()))
            break
        case "pets":
            setItems(Object.values(gameConfigManager.getPetItems()))
            break
        case "backgrounds":
            setItems(Object.values(gameConfigManager.getBackgroundItems()))
            break
        case "items": {
            const combined: ShopItem[] = [
                ...Object.values(gameConfigManager.getToyItems()),
                ...Object.values(gameConfigManager.getCleaningItems()),
                ...Object.values(gameConfigManager.getFurnitureItems()),
                ...Object.values(gameConfigManager.getBackgroundItems()),
            ]
            setItems(combined)
            break
        }
        default:
            setItems([])
        }
    }, [category])

    if (!isOpen) return null

    const handleBuy = (item: ShopItem) => {
        const mappedCategory =
      category === "backgrounds"
          ? "background"
          : category === "pets"
              ? "pet"
              : category === "items"
                  ? ((): "toy" | "clean" | "background" | "furniture" => {
                      const t = detectItemType(item)
                      if (t === "toy") return "toy"
                      if (t === "clean") return "clean"
                      if (t === "background" || t === "backgrounds") return "background"
                      return "furniture"
                  })()
                  : (category as "food" | "toy" | "clean" | "furniture")
        // Use dedicated buy pet flow
        if (category === "pets") {
            try {
                const petType =
          (item as PetItem).texture || (item as PetItem).species || item.name
                console.log("petType", petType)
                console.log("item", item)
                scene.getPetManager().buyPet(petType, (item as PetItem).id)
            } catch {
                // fallback to generic message
                scene.sendBuyFoodLegacy({
                    itemType: "pet",
                    itemName: item.name,
                    quantity: 1,
                    itemId: String((item as PetItem).id || ""),
                })
            }
            return
        }
        // For food: defer purchase until user drops in scene
        if (mappedCategory === "food") {
            try {
                const cursorUrl = getItemImageSrc("food", item)
                console.log("cursorUrl", cursorUrl)
                // Store placing state on scene registry for InputManager to consume
                scene.registry.set("placingItem", {
                    type: "food",
                    itemId: String((item as FoodItem).id),
                    itemName: item.name,
                    cursorUrl,
                })
                // Switch cursor to selected food image for placement mode
                if (cursorUrl) {
                    try {
                        scene.input.setDefaultCursor(`url(${cursorUrl}), pointer`)
                    } catch {
                        // ignore cursor errors
                    }
                }
                // Close modal so user can click to place
                onClose()
            } catch (e) {
                console.error("Failed to start placing food", e)
            }
            return
        }

        // For toy: defer purchase until user drops in scene (same UX as food)
        if (mappedCategory === "toy") {
            try {
                const cursorUrl = getItemImageSrc("toy", item)
                // Store placing state on scene registry for InputManager to consume
                scene.registry.set("placingItem", {
                    type: "toy",
                    itemId: String((item as ToyItem).id),
                    itemName: item.name,
                    cursorUrl,
                })
                // Switch cursor to selected toy image for placement mode
                if (cursorUrl) {
                    try {
                        scene.input.setDefaultCursor(`url(${cursorUrl}), pointer`)
                    } catch {
                        // ignore cursor errors
                    }
                }
                // Close modal so user can click to place
                onClose()
            } catch (e) {
                console.error("Failed to start placing toy", e)
            }
            return
        }
        if (mappedCategory === "clean") {
            try {
                const cursorUrl = getItemImageSrc("clean", item)
                console.log("cursorUrl", cursorUrl)

                // Resize and set cursor - extract first frame from sprite sheet
                // Broom sprite sheet has 6 frames, each 74px wide
                createResizedCursor(
                    cursorUrl,
                    64,
                    (resizedUrl) => {
                        console.log(
                            "Resized broom cursor URL:",
                            resizedUrl.substring(0, 50)
                        )

                        scene.registry.set("placingItem", {
                            type: "clean",
                            itemId: String((item as CleaningItem).id),
                            itemName: item.name,
                            cursorUrl: resizedUrl, // Use resized single-frame cursor
                        })

                        try {
                            scene.input.setDefaultCursor(`url(${resizedUrl}) 32 32, pointer`)
                            console.log("Cursor set successfully for clean item")
                        } catch (error) {
                            console.error("Failed to set cursor", error)
                        }
                        onClose()
                    },
                    { frameWidth: 74, frameIndex: 0 }
                )
            } catch (error) {
                console.error("Failed to start placing clean", error)
            }
            return
        }
        // Other categories keep legacy immediate purchase
        scene.sendBuyFoodLegacy({
            itemType: mappedCategory,
            itemName: item.name,
            quantity: 1,
            itemId: String(item.id),
        })
    }

    return (
        <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* Header - Matching the image design */}
            <div className="relative bg-[#2a2a2a] px-4 py-3 border-b border-[rgba(135,135,135,0.25)]">
                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#323232] rounded-full flex items-center justify-center border-none cursor-pointer"
                >
                    <svg
                        className="w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* PET RISING Logo */}
                <div className="flex items-center justify-center">
                    <NomasImage
                        src={assets.petRisingStoreLogo}
                        alt="Pet Rising Store Logo"
                        className="h-12 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Balance Section */}
            <div className="bg-[#2a2a2a] px-2 py-1.5 border-b border-[rgba(135,135,135,0.25)]">
                <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="text-sm text-muted pl-1">Balance</div>
                            <NomasInput
                                value={balance.toLocaleString()}
                                prefixIcon={
                                    <NomasImage
                                        src={assets.nomasCoin}
                                        alt="NOM"
                                        className="w-4 h-4"
                                    />
                                }
                                currency="NOM"
                                numericOnly
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="text-sm text-muted pl-1">Earnings</div>
                            <NomasInput
                                value="0"
                                prefixIcon={
                                    <NomasImage
                                        src={assets.nomasCoin}
                                        alt="NOM"
                                        className="w-4 h-4"
                                    />
                                }
                                currency="NOM"
                                numericOnly
                                readOnly
                            />
                        </div>
                    </div>
                    <NomasButton xlSize>Claim</NomasButton>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[rgba(135,135,135,0.25)]">
                <ScrollArea className="w-full">
                    <div className="relative flex gap-2">
                        {[
                            { k: "pets", t: "Pets" },
                            { k: "food", t: "Food" },
                            { k: "toy", t: "Toys" },
                            { k: "clean", t: "Cleaning" },
                            { k: "furniture", t: "Furniture" },
                            { k: "backgrounds", t: "Backgrounds" },
                        ].map((tab) => (
                            <button
                                key={tab.k}
                                data-key={tab.k}
                                onClick={() => setCategory(tab.k)}
                                className={`px-3 py-1.5 rounded-[30px] text-sm font-medium whitespace-nowrap
                           transition-all duration-200 ${
                            category === tab.k
                                ? "bg-[#8b5cf6] text-white"
                                : "bg-transparent text-gray-400 hover:text-white"
                            }`}
                            >
                                {tab.t}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Items Grid */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-[#2a2a2a] rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-4xl">📦</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                Items Coming Soon!
                            </h3>
                            <p className="text-gray-400">New items will be added regularly</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleBuy(item)}
                                    className="group bg-[rgba(60,60,60,0.26)] border border-[rgba(0,0,0,0.37)]
                             rounded-[14px] px-1.5 py-2 flex flex-col items-center justify-center
                             gap-1.5 cursor-pointer opacity-100
                             shadow-[inset_0px_3px_5px_0px_rgba(0,0,0,0.3)] hover:bg-[rgba(80,80,80,0.4)]
                             transition-all duration-200"
                                >
                                    {/* Item Image */}
                                    <div className="w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center">
                                        <img
                                            src={getItemImageSrc(category, item)}
                                            className="w-full h-full object-cover object-[0%_50%]"
                                            style={{
                                                // For cleaning sprite sheets, show only leftmost section
                                                maxWidth:
                          category === "clean" ||
                          detectItemType(item) === "clean"
                              ? "calc(100% * 6)"
                              : "100%",
                                                transform:
                          category === "clean" ||
                          detectItemType(item) === "clean"
                              ? "translateX(0)"
                              : "none",
                                            }}
                                        />
                                    </div>

                                    {/* Item Info */}
                                    <div className="font-semibold text-[13px] text-[#B3B3B3] text-center">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-[#B3B3B3]">
                                        {Number(item.cost_nom ?? 0).toLocaleString()} NOM
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
