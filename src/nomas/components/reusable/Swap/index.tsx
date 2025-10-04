import React from "react"
import { NomasCard } from "../../extends"
import { SwapPage, useAppSelector } from "../../../redux"
import { SelectTokenPage } from "./SelectTokenPage"
import { NomasAggregationPage } from "./NomasAggregationPage"

export const Swap = () => {
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
    return <NomasCard asCore>{renderPage()}</NomasCard>
}
