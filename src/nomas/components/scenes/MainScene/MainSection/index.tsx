import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { SwapSection } from "./SwapSection"
import { HomeSection } from "./HomeSection"
import { HomeTab } from "@/nomas/redux"
import { GameSection } from "./GameSection"
import { PerpSection } from "./PerpSection"

export const MainSection = () => {
    const homeTab = useAppSelector((state) => state.stateless.tabs.homeTab)
    const renderContent = () => {
        switch (homeTab) {
        case HomeTab.Home:  {
            return <HomeSection />
        }
        case HomeTab.Trade: {
            return <SwapSection />
        }
        case HomeTab.Perp: {
            return <PerpSection />
        }
        case HomeTab.Game: {
            return <GameSection />
        }
        case HomeTab.Defi: {
            return <div />
        }
        default:
            throw new Error(`Unknown function: ${homeTab}`)
        }
    }
    return <>{renderContent()}</>
}