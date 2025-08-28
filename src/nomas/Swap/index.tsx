import React from "react"
import { NomasCard } from "../components"
import { SwapPageState, useAppSelector } from "../redux"
import { SelectTokenPage } from "./SelectTokenPage"
import { SwapPage } from "./SwapPage"
export const Swap = () => {
    const swapPage = useAppSelector(state => state.pages.swapPage)
    const renderPage = () => {
        switch (swapPage) {
        case SwapPageState.SelectToken:
            return <SelectTokenPage />
        case SwapPageState.Swap:
            return <SwapPage />
        }
    }
    return (
        <NomasCard asCore>
            {renderPage()}
        </NomasCard>
    )
}