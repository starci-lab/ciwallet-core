import React from "react"
import { NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapPage, useAppSelector } from "@/nomas/redux"
import { SelectTokenPage } from "./SelectTokenPage"
import { NomasAggregationPage } from "./NomasAggregationPage"

export const SwapFunction = () => {
    const swapPage = useAppSelector((state) => state.stateless.pages.swapPage)
    const renderPage = () => {
        switch (swapPage) {
        case SwapPage.Swap:
            return <SelectTokenPage />
        case SwapPage.SelectToken:
            return <div/>
        case SwapPage.NomasAggregation:
            return <NomasAggregationPage />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}
