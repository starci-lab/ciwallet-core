import React from "react"
import { PortfolioFunctionPage, useAppSelector } from "@/nomas/redux"
import { PortfolioPage } from "./PortfolioPage"
import { TokenDetailsPage } from "./TokenDetailsPage"
import { SearchTokenPage } from "./SearchTokenPage"

export const PortfolioFunction = () => {
    const portfolioFunctionPage = useAppSelector(
        (state) => state.stateless.sections.home.portfolioFunctionPage
    )
    const renderPage = () => {
        switch (portfolioFunctionPage) {
        case PortfolioFunctionPage.Portfolio: {
            return <PortfolioPage />
        }
        case PortfolioFunctionPage.TokenDetails: {
            return <TokenDetailsPage />
        }
        case PortfolioFunctionPage.SearchToken: {
            return <SearchTokenPage />
        }
        }
    }
    return renderPage()
}