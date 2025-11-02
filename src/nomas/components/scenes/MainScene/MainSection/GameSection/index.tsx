import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/nomas/redux"
import { GameFunctionPage } from "@/nomas/redux"
import { GameSplashPage } from "./GameSplashPage"
import { GameShopPage } from "./GameShopPage"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"

export const GameSection = () => {
  const gameFunctionPage = useAppSelector(
    (state) => state.stateless.sections.home.gameFunctionPage
  )
  const [isShopOpen, setIsShopOpen] = useState(false)

  // Listen to shop events for visibility control
  useEffect(() => {
    const handleOpen = () => setIsShopOpen(true)
    const handleClose = () => setIsShopOpen(false)

    eventBus.on(ShopEvents.OpenShop, handleOpen)
    eventBus.on(ShopEvents.CloseShop, handleClose)

    return () => {
      eventBus.off(ShopEvents.OpenShop, handleOpen)
      eventBus.off(ShopEvents.CloseShop, handleClose)
    }
  }, [])

  const renderContent = () => {
    // Shop page takes priority when open (event-driven)
    if (isShopOpen) {
      return <GameShopPage />
    }

    // Fallback to Redux routing for other pages
    switch (gameFunctionPage) {
      case GameFunctionPage.GameSplash: {
        return <GameSplashPage />
      }
      case GameFunctionPage.Shop: {
        return <GameShopPage />
      }
      case GameFunctionPage.PetDetails: {
        return <div>PetDetails</div>
      }
      default:
        return <GameSplashPage />
    }
  }
  return <>{renderContent()}</>
}
