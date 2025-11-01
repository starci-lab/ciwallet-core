import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { GameFunctionPage } from "@/nomas/redux"
import { GameSplashPage } from "./GameSplashPage"

export const GameSection = () => {
    const gameFunctionPage = useAppSelector((state) => state.stateless.sections.home.gameFunctionPage)
    const renderContent = () => {
        switch (gameFunctionPage) {
        case GameFunctionPage.GameSplash: {
            return <GameSplashPage />
        }
        case GameFunctionPage.Shop: {
            return <div>Shop</div>
        }
        case GameFunctionPage.PetDetails: {
            return <div>PetDetails</div>
        }
        default:
            throw new Error(`Unknown function: ${gameFunctionPage}`)
        }
    }
    return <>{renderContent()}</>
}