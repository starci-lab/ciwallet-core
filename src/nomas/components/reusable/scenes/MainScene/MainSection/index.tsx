import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { HomeTab } from "@/nomas/redux"
import { DepositFunction } from "./DepositFunction"
import { SwapFunction } from "./SwapFunction"

export const MainSection = () => {
    const homeTab = useAppSelector((state) => state.stateless.tabs.homeTab)
    const renderContent = () => {
        switch (homeTab) {
        case HomeTab.Home: {
            return <DepositFunction />
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