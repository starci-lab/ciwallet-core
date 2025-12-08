import React from "react"
import { 
    PortfolioFunctionPage, 
    setPortfolioFunctionPage, 
    setSearchSelectedChainId, 
    setSearchSelectedChainIdQuery, 
    useAppDispatch, 
    useAppSelector
} from "@/nomas/redux"
import { PortfolioPage } from "./PortfolioPage"
import { TokenDetailsPage } from "./TokenDetailsPage"
import { SearchTokenPage } from "./SearchTokenPage"
import { ChooseNetworkPage } from "@/nomas/components/styled/ChooseNetworkPage"

export const PortfolioFunction = () => {
    const portfolioFunctionPage = useAppSelector(
        (state) => state.stateless.sections.home.portfolioFunctionPage
    )
    const searchSelectedChainIdQuery = useAppSelector((state) => state.stateless.sections.home.searchSelectedChainIdQuery)
    const searchSelectedChainId = useAppSelector((state) => state.stateless.sections.home.searchSelectedChainId)
    const dispatch = useAppDispatch()
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
        case PortfolioFunctionPage.ChooseNetwork:
            return <ChooseNetworkPage
                withAllNetworks={true}
                isSelected={(chainId) => searchSelectedChainId === chainId} 
                showBackButton={true} 
                isPressable={true}
                onPress={(chainId) => {
                    dispatch(setSearchSelectedChainId(chainId))
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.SearchToken))
                }}
                onSearchQueryChange={(query) => {
                    dispatch(setSearchSelectedChainIdQuery(query))
                }}
                searchQuery={searchSelectedChainIdQuery}
                onBackButtonPress={() => {
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.SearchToken))
                }}
            />
        }
    }
    return renderPage()
}