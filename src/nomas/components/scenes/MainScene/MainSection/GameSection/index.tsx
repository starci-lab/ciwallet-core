import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/nomas/redux"
import { GameFunctionPage } from "@/nomas/redux"
import { GameSplashPage } from "./GameSplashPage"
import { GameShopPage } from "./GameShopPage"
import { GameHomePage } from "./GameHomePage"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"
import {
  HomeEvents,
  type OpenHomeWithPetPayload,
} from "@/nomas/game/events/home/HomeEvents"

export const GameSection = () => {
  const gameFunctionPage = useAppSelector(
    (state) => state.stateless.sections.home.gameFunctionPage
  )
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isHomeOpen, setIsHomeOpen] = useState(false)

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

  // Listen to home events for visibility control
  useEffect(() => {
    const handleOpen = () => {
      console.log("🏠 GameSection: Home opened event received")
      setIsHomeOpen(true)
    }
    const handleOpenWithPet = (_payload: OpenHomeWithPetPayload) => {
      console.log("🏠 GameSection: Home opened with pet event received")
      setIsHomeOpen(true)
    }
    const handleClose = () => {
      console.log("🏠 GameSection: Home closed event received")
      setIsHomeOpen(false)
    }

    eventBus.on(HomeEvents.OpenHome, handleOpen)
    eventBus.on(HomeEvents.OpenHomeWithPet, handleOpenWithPet)
    eventBus.on(HomeEvents.CloseHome, handleClose)

    return () => {
      eventBus.off(HomeEvents.OpenHome, handleOpen)
      eventBus.off(HomeEvents.OpenHomeWithPet, handleOpenWithPet)
      eventBus.off(HomeEvents.CloseHome, handleClose)
    }
  }, [])

  const renderContent = () => {
    if (isHomeOpen) {
      return <GameHomePage />
    }

    if (isShopOpen) {
      return <GameShopPage />
    }

    switch (gameFunctionPage) {
      case GameFunctionPage.GameSplash: {
        return <GameSplashPage />
      }
      case GameFunctionPage.Shop: {
        return <GameShopPage />
      }
      case GameFunctionPage.PetDetails: {
        return <GameHomePage />
      }
      default:
        return <GameSplashPage />
    }
  }
  return <>{renderContent()}</>
}
