import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { SwapFunction } from "./SwapFunction"
import { HomeSection } from "./HomeSection"
import { HomeTab } from "@/nomas/redux"

export const MainSection = () => {
    const homeTab = useAppSelector((state) => state.stateless.tabs.homeTab)
    const renderContent = () => {
        switch (homeTab) {
        case HomeTab.Home:  {
            return <HomeSection />
        }
        case HomeTab.Trade: {
            return <SwapFunction />
        }
        default:
            throw new Error(`Unknown function: ${homeTab}`)
        }
    }
    return <>{renderContent()}</>
}