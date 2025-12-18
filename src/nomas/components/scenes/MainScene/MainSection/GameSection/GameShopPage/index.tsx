/* eslint-disable indent */
import { useCallback, useState } from "react"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"
import type { BackgroundItem } from "@/nomas/game/configs/gameConfig"
import type { FoodItem, ToyItem, PetItem, CleaningItem } from "@/nomas/game/configs/gameConfig"
import type { ShopCategoryKey } from "@/types/game"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import { selectCurrentBackground, setCurrentBackground } from "@/nomas/redux/slices/stateless/user"
import { getShopItemAssetPath } from "@/nomas/utils/assetPath"
import createResizedCursor from "@/nomas/utils/resizeImage"
import { NomasCard, NomasCardBody, NomasCardVariant } from "@/nomas/components"
import { assetsConfig, getUrl } from "@/nomas/resources"
import { useShopItems, useShopOwnership, useBackgroundPurchaseFlow } from "./hooks"
import { getBackgroundTextureKey, getBackgroundKey } from "./utils/shopKeys"
import type { ShopItem } from "@/types/game"
import { ShopHeader, ShopBalance, ShopTabs, ShopGrid } from "./components"

/**
 * GameShopPage - Full page shop component
 * Replaces GameSplashPage when shop is opened via ShopEvents.OpenShop
 * Displays shop UI similar to ReactShopModal but as a full page layout
 */
export const GameShopPage = () => {
    const [category, setCategory] = useState<ShopCategoryKey>("pets")

    const dispatch = useAppDispatch()
    const balance = useAppSelector((state) => state.stateless.user.nomToken)
    const ownedItems = useAppSelector((state) => state.stateless.user.ownedItems)
    const currentBackgroundId = useAppSelector(selectCurrentBackground)
    const assets = assetsConfig().game

    // Hooks
    const items = useShopItems(category)

    const getItemImageUrl = useCallback((cat: ShopCategoryKey, shopItem: ShopItem): string => {
        return getUrl(getShopItemAssetPath(cat, shopItem))
    }, [])

    const handleChangeBackground = useCallback(
        (item: BackgroundItem) => {
            const textureKey = getBackgroundTextureKey(item)
            const bgKey = getBackgroundKey(item)

            // Emit event to change background in GameScene
            eventBus.emit(ShopEvents.ChangeBackground, {
                itemId: bgKey,
                itemName: item.name,
                textureKey
            })

            // Update Redux state
            dispatch(setCurrentBackground(bgKey))
        },
        [dispatch]
    )

    const {
        pendingBackgroundPurchaseId,
        optimisticOwnedBackgroundKeys,
        setPendingBackground,
        getBackgroundKey: getBgKey
    } = useBackgroundPurchaseFlow(handleChangeBackground)

    const { isItemOwned, detectItemType } = useShopOwnership(ownedItems, optimisticOwnedBackgroundKeys)

    const handleBuy = useCallback(
        (item: ShopItem) => {
            const mappedCategory =
                category === "backgrounds"
                    ? "background"
                    : category === "pets"
                      ? "pet"
                      : (category as "food" | "toy" | "clean" | "furniture")

            if (category === "pets") {
                const petType = String((item as PetItem).texture ?? item.name ?? "")
                eventBus.emit(ShopEvents.BuyPet, {
                    petType,
                    petId: String((item as PetItem).displayId),
                    petName: item.name
                })
                return
            }

            if (mappedCategory === "food") {
                const cursorUrl = getItemImageUrl("food", item)
                eventBus.emit(ShopEvents.StartPlacing, {
                    itemType: "food",
                    itemId: String((item as FoodItem).displayId),
                    itemName: item.name,
                    cursorUrl
                })
                return
            }

            if (mappedCategory === "toy") {
                const cursorUrl = getItemImageUrl("toy", item)
                eventBus.emit(ShopEvents.StartPlacing, {
                    itemType: "toy",
                    itemId: String((item as ToyItem).id || (item as ToyItem).displayId.toLocaleLowerCase()),
                    itemName: item.name,
                    cursorUrl
                })
                return
            }

            if (mappedCategory === "clean") {
                const cursorUrl = getItemImageUrl("clean", item)
                createResizedCursor(
                    cursorUrl,
                    64,
                    (resizedUrl) => {
                        eventBus.emit(ShopEvents.StartPlacing, {
                            itemType: "clean",
                            itemId: String(
                                (item as CleaningItem).id || (item as CleaningItem).displayId.toLocaleLowerCase()
                            ),
                            itemName: item.name,
                            cursorUrl: resizedUrl
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
                    itemName: item.name
                })
                return
            }

            if (mappedCategory === "background") {
                // Prevent double-purchase spam while a background purchase is pending
                if (pendingBackgroundPurchaseId) return

                // Background UX: purchase then auto-apply right after server confirms
                setPendingBackground(item as BackgroundItem)
                eventBus.emit(ShopEvents.BuyBackground, {
                    itemType: "background",
                    itemId: String(item.id),
                    itemName: item.name
                })
                return
            }
        },
        [category, getItemImageUrl, pendingBackgroundPurchaseId, setPendingBackground]
    )

    const handleClose = useCallback(() => {
        eventBus.emit(ShopEvents.CloseShop)
    }, [])

    const handleItemClick = useCallback(
        (item: ShopItem, isBackground: boolean, owned: boolean) => {
            // If background and owned, allow clicking to change background
            if (isBackground && owned) {
                handleChangeBackground(item as BackgroundItem)
                return
            }
            // For other items or unowned items, use normal buy flow
            if (owned) return
            handleBuy(item)
        },
        [handleBuy, handleChangeBackground]
    )

    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardBody className="relative w-full min-h-[500px]">
                <div className="w-full h-full bg-card-dark-3 flex flex-col radius-card-inner">
                    <ShopHeader assets={assets} onClose={handleClose} />
                    <ShopBalance balance={balance} assets={assets} />
                    <ShopTabs category={category} setCategory={setCategory} />
                    <ShopGrid
                        items={items}
                        category={category}
                        isItemOwned={isItemOwned}
                        detectItemType={detectItemType}
                        getBackgroundKey={getBgKey}
                        getItemImageUrl={getItemImageUrl}
                        currentBackgroundId={currentBackgroundId}
                        pendingBackgroundPurchaseId={pendingBackgroundPurchaseId}
                        onItemClick={handleItemClick}
                    />
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}
