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
import { roundNumber } from "@ciwallet-sdk/utils"

export const PortfolioFunction = () => {
    const portfolioFunctionPage = useAppSelector(
        (state) => state.stateless.sections.home.portfolioFunctionPage
    )
    const searchSelectedChainIdQuery = useAppSelector((state) => state.stateless.sections.home.searchSelectedChainIdQuery)
    const selectedChainId = useAppSelector((state) => state.stateless.sections.home.selectedChainId)
    const dispatch = useAppDispatch()
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    const network = useAppSelector((state) => state.persists.session.network)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
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
                isSelected={(chainId) => selectedChainId === chainId} 
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
                endContent={
                    (chainId) => {
                        if (chainId === "all-network") {
                            throw new Error("All networks not supported")
                        }
                        const chainTokens = tokens[chainId][network]
                        const totalValue = chainTokens.reduce(
                            (acc: number, token) => acc + (balances[token.tokenId] ?? 0) * (prices[token.tokenId] ?? 0), 0)
                        return (
                            <div className="text-sm">${roundNumber(totalValue)}</div>
                        )
                    }}
            />
        }
    }
    return renderPage()
}