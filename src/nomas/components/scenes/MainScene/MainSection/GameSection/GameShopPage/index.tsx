/* eslint-disable indent */
import { useEffect, useRef, useState } from "react"
import { gameConfigManager } from "@/nomas/game/configs/gameConfig"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"
import type {
  FoodItem,
  ToyItem,
  PetItem,
  BackgroundItem,
  CleaningItem,
  FurnitureItem,
} from "@/nomas/game/configs/gameConfig"
import { useAppSelector } from "@/nomas/redux"
import { getShopItemAssetPath } from "@/nomas/utils/assetPath"
import createResizedCursor from "@/nomas/utils/resizeImage"
import { ScrollArea } from "@/nomas/components/shadcn/scroll-area"
import {
  NomasImage,
  NomasInput,
  NomasCard,
  NomasCardBody,
  NomasCardVariant,
} from "@/nomas/components"
import { assetsConfig } from "@/nomas/resources"

/**
 * Union type for all shop items
 */
type ShopItem =
  | FoodItem
  | ToyItem
  | PetItem
  | BackgroundItem
  | CleaningItem
  | FurnitureItem

/**
 * GameShopPage - Full page shop component
 * Replaces GameSplashPage when shop is opened via ShopEvents.OpenShop
 * Displays shop UI similar to ReactShopModal but as a full page layout
 */
export const GameShopPage = () => {
  // Shop UI state
  const [category, setCategory] = useState<string>("food")
  const [items, setItems] = useState<ShopItem[]>([])

  // Get balance from Redux
  const balance = useAppSelector((state) => state.stateless.user.nomToken)
  const assets = assetsConfig().game

  // Tabs container ref for scrolling
  const tabsContainerRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
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
  }, [category])

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
      default:
        setItems([])
    }
  }, [category])

  const handleBuy = (item: ShopItem) => {
    const mappedCategory =
      category === "backgrounds"
        ? "background"
        : category === "pets"
        ? "pet"
        : (category as "food" | "toy" | "clean" | "furniture")

    if (category === "pets") {
      const petType =
        (item as PetItem).texture || (item as PetItem).species || item.name
      eventBus.emit(ShopEvents.BuyPet, {
        petType,
        petId: String((item as PetItem).id),
        petName: item.name,
      })
      return
    }

    if (mappedCategory === "food") {
      const cursorUrl = getItemImageSrc("food", item)
      eventBus.emit(ShopEvents.StartPlacing, {
        itemType: "food",
        itemId: String((item as FoodItem).id),
        itemName: item.name,
        cursorUrl,
      })
      return
    }

    if (mappedCategory === "toy") {
      const cursorUrl = getItemImageSrc("toy", item)
      eventBus.emit(ShopEvents.StartPlacing, {
        itemType: "toy",
        itemId: String((item as ToyItem).id),
        itemName: item.name,
        cursorUrl,
      })
      return
    }

    if (mappedCategory === "clean") {
      const cursorUrl = getItemImageSrc("clean", item)
      createResizedCursor(
        cursorUrl,
        64,
        (resizedUrl) => {
          eventBus.emit(ShopEvents.StartPlacing, {
            itemType: "clean",
            itemId: String((item as CleaningItem).id),
            itemName: item.name,
            cursorUrl: resizedUrl,
          })
        },
        { frameWidth: 74, frameIndex: 0 }
      )
      return
    }

    // Immediate purchase: furniture
    if (mappedCategory === "furniture") {
      eventBus.emit(ShopEvents.BuyFurniture, {
        itemType: "furniture",
        itemId: String(item.id),
        itemName: item.name,
      })
      return
    }

    if (mappedCategory === "background") {
      eventBus.emit(ShopEvents.BuyBackground, {
        itemType: "background",
        itemId: String(item.id),
        itemName: item.name,
      })
      return
    }
  }

  const handleClose = () => {
    eventBus.emit(ShopEvents.CloseShop)
  }

  return (
    <NomasCard variant={NomasCardVariant.Gradient} isContainer>
      <NomasCardBody className="relative w-full min-h-[500px]">
        <div className="w-full h-full bg-card-dark-3 flex flex-col radius-card-inner">
          {/* Header */}
          <div className="relative bg-card-dark-4 px-3 py-2 border-b border-muted rounded-t-[var(--card-radius-inner)]">
            {/* Back/Close Button */}
            <button
              onClick={handleClose}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-card-dark-5 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-card-dark-6 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-muted"
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

            {/* Title/Logo */}
            <div className="flex items-center justify-center">
              <NomasImage
                src={assets.petRisingStoreLogo}
                alt="Pet Rising Store Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          {/* Balance Section */}
          <div className="bg-card-dark-4 px-2 py-1 border-b border-muted">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted pl-1">Balance</div>
                  <NomasInput
                    value={balance.toLocaleString()}
                    prefixIcon={
                      <NomasImage
                        src={assets.nomasCoin}
                        alt="NOM"
                        className="w-3 h-3"
                      />
                    }
                    currency="NOM"
                    numericOnly
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-card-dark-3 px-4 py-3 border-b border-muted shrink-0">
            <ScrollArea className="w-full">
              <div
                ref={tabsContainerRef}
                className="relative flex gap-2 overflow-x-auto"
              >
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

          {/* Items Grid */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-card-dark-4 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-4xl">📦</span>
                  </div>
                  <h3 className="text-xl font-semibold text mb-2">
                    Items Coming Soon!
                  </h3>
                  <p className="text-muted">
                    New items will be added regularly
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleBuy(item)}
                      className="group bg-shop-item border border-shop-item
                             rounded-[14px] px-1.5 py-2 flex flex-col items-center justify-center
                             gap-1.5 cursor-pointer opacity-100
                             shadow-shop-item hover:bg-shop-item-hover
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
                      <div className="font-semibold text-[13px] text-muted text-center">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted">
                        {Number(item.cost_nom ?? 0).toLocaleString()} NOM
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </NomasCardBody>
    </NomasCard>
  )
}
