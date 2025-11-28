import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasInput, NomasSpacer, SelectChainTab, SelectChainTabVariant, TokenCard, UnifiedTokenCard } from "@/nomas/components"
import { tokenManagerObj } from "@/nomas/obj"
import { addTrackingTokenId, addTrackingUnifiedTokenId, PortfolioFunctionPage, removeTrackingTokenId, removeTrackingUnifiedTokenId, selectTokens, setPortfolioFunctionPage, setSearchTokenQuery, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"

export const SearchTokenPage = () => {
    const dispatch = useAppDispatch()
    const searchTokenQuery = useAppSelector((state) => state.stateless.sections.home.searchTokenQuery)
    const searchSelectedChainId = useAppSelector((state) => state.stateless.sections.home.searchSelectedChainId)
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
        .filter((token) => !token.unifiedTokenId)
    const unifiedTokens = useMemo(() => tokenManagerObj.getUnifiedTokens(), [])
    const filteredTokenArray = useMemo(() => {
        return tokenArray.filter((token) => {
            const filteredTokens = token.name.toLowerCase().includes(searchTokenQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchTokenQuery.toLowerCase()) || token.address?.toLowerCase()?.includes(searchTokenQuery.toLowerCase())
            if (searchSelectedChainId === "all-network") {
                return filteredTokens
            }
            return filteredTokens && token.chainId === searchSelectedChainId
        })
    }, [tokenArray, searchTokenQuery])
    const filteredUnifiedTokenArray = useMemo(() => {
        const _unifiedTokens = unifiedTokens.filter((unifiedToken) => {
            return unifiedToken.name.toLowerCase().includes(searchTokenQuery.toLowerCase()) || unifiedToken.symbol.toLowerCase().includes(searchTokenQuery.toLowerCase())
        })
        if (searchSelectedChainId === "all-network") {
            return _unifiedTokens
        }
        return []
    }, [unifiedTokens, searchTokenQuery])
    const trackingTokenIds = useAppSelector((state) => state.persists.session.trackingTokenIds)
    const trackingUnifiedTokenIds = useAppSelector((state) => state.persists.session.trackingUnifiedTokenIds)
    return (
        <>
            <NomasCardHeader
                title="Search Token"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.Portfolio))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Transparent} isInner>
                    <SelectChainTab 
                        withAllNetworks={true}
                        variant={SelectChainTabVariant.Dark}
                        isSelected={(chainId) => chainId === searchSelectedChainId}
                        onClick={() => {
                            dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.ChooseNetwork))
                        }}
                    />
                    <NomasSpacer y={4}/>
                    <NomasInput
                        placeholder="Search token by name, symbol, or address"
                        onValueChange={(value) => {
                            dispatch(setSearchTokenQuery(value))
                        }}
                        value={searchTokenQuery}
                    />
                    <NomasSpacer y={4} />
                    <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                        <NomasCardBody className="gap-4 flex flex-col p-0" scrollable scrollHeight={300}>
                            {filteredUnifiedTokenArray.map((unifiedToken) => (
                                <UnifiedTokenCard 
                                    className="p-0 py-1"
                                    isPressable
                                    isPinned={trackingUnifiedTokenIds.includes(unifiedToken.unifiedTokenId) ?? false}
                                    key={unifiedToken.unifiedTokenId}
                                    token={unifiedToken}
                                    onPin={() => {
                                        dispatch(addTrackingUnifiedTokenId(unifiedToken.unifiedTokenId))
                                    }}
                                    onUnpin={() => {
                                        dispatch(removeTrackingUnifiedTokenId(unifiedToken.unifiedTokenId))
                                    }}
                                />
                            ))}
                            {filteredTokenArray.map((token) => (
                                <TokenCard 
                                    className="p-0 py-1"
                                    isPressable
                                    isPinned={trackingTokenIds.includes(token.tokenId) ?? false}
                                    key={token.tokenId}
                                    token={token}
                                    chainId={token.chainId}
                                    onPin={() => {
                                        dispatch(addTrackingTokenId(token.tokenId))
                                    }}
                                    onUnpin={() => {
                                        dispatch(removeTrackingTokenId(token.tokenId))
                                    }}
                                />
                            ))}
                        </NomasCardBody>
                    </NomasCard>
                </NomasCard>
            </NomasCardBody>        
        </>
    )
}