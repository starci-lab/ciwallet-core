import { NomasCard, NomasCardVariant } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"
import React from "react"
import { PerpSectionPage } from "@/nomas/redux"
import { PerpPage } from "./PerpPage"
import { DepositPage } from "./DepositPage"
import { SelectAssetPage } from "./SelectAssetPage"
import { SourceChainPage } from "./SourceChainPage"
import { MarginModePage } from "./MarginModePage"
import { LeveragePage } from "./LeveragePage"
import { SelectOrderTypePage } from "./SelectOrderTypePage"
import { LongShortPage } from "./LongShortPage"

export const PerpSection = () => {
    const perpSectionPage = useAppSelector((state) => state.stateless.sections.perp.perpSectionPage)   
    const renderPage = () => {
        switch (perpSectionPage) {
        case PerpSectionPage.Perp:
            return <PerpPage />
        case PerpSectionPage.Deposit:
            return <DepositPage />
        case PerpSectionPage.SelectAsset:
            return <SelectAssetPage />
        case PerpSectionPage.SourceChain:
            return <SourceChainPage />
        case PerpSectionPage.MarginMode:
            return <MarginModePage />
        case PerpSectionPage.Leverage:
            return <LeveragePage />
        case PerpSectionPage.OrderType:
            return <SelectOrderTypePage />
        case PerpSectionPage.LongShort:
            return <LongShortPage />
        }
    }
    return <NomasCard 
        variant={NomasCardVariant.Gradient} 
        isContainer
    >
        {renderPage()}
    </NomasCard>
}