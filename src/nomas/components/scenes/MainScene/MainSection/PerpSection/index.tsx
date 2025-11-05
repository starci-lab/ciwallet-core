import { NomasCard, NomasCardVariant } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"
import React from "react"
import { PerpSectionPage } from "@/nomas/redux"
import { PerpPage } from "./PerpPage"
import { DepositPage } from "./DepositPage"

export const PerpSection = () => {
    const perpSectionPage = useAppSelector((state) => state.stateless.sections.perp.perpSectionPage)
    const renderPage = () => {
        switch (perpSectionPage) {
        case PerpSectionPage.Perp:
            return <PerpPage />
        case PerpSectionPage.Deposit:
            return <DepositPage />
        }
    }
    return <NomasCard 
        variant={NomasCardVariant.Gradient} 
        isContainer
    >
        {renderPage()}
    </NomasCard>
}