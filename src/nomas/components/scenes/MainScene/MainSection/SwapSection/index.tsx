import React from "react"
import { NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapPage, useAppSelector } from "@/nomas/redux"
import { NomasAggregationPage } from "./NomasAggregationFunction"
import { SwapFunction } from "./SwapFunction"
export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.pages.swapPage)
    const renderPage = () => {
        switch (swapPage) {
        case SwapPage.Swap:
            return <SwapFunction />
        case SwapPage.SelectToken:
            return <div/>
        case SwapPage.NomasAggregation:
            return <NomasAggregationPage />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}
