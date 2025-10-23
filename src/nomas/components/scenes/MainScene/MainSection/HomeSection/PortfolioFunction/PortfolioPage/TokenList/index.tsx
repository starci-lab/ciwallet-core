import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, UnifiedTokenCard2 } from "@/nomas/components"
import { selectSelectedAccounts, useAppSelector, setSelectedToken, SelectedTokenType, useAppDispatch, setPortfolioFunctionPage, PortfolioFunctionPage, type TokenItem, setTokenItems } from "@/nomas/redux"
import { tokenManagerObj } from "@/nomas/obj"
import { ChainId, type Token } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const TokenList = () => {
    const trackingTokenIds = useAppSelector((state) => state.persists.session.trackingTokenIds)
    const trackingUnifiedTokenIds = useAppSelector((state) => state.persists.session.trackingUnifiedTokenIds)
    const unifiedTokens = tokenManagerObj.getUnifiedTokens()
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const network = useAppSelector((state) => state.persists.session.network)
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    const trackingUnifiedTokens = unifiedTokens.filter((unifiedToken) => trackingUnifiedTokenIds.includes(unifiedToken.unifiedTokenId))
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4">
                {
                    trackingUnifiedTokens.map((unifiedToken) => {
                        const tokenItems: Array<TokenItem> = []
                        const _tokens = Object.values(tokens).flat().flatMap((record) => Object.values(record).flat())
                            .reduce((acc: Array<Token>, token) => {
                                if (!acc.find((t) => t.tokenId === token.tokenId)) {
                                    acc.push(token)
                                }
                                return acc
                            }, [] as Array<Token>)
                        const tokensSameUnifiedTokenId = _tokens.filter((token) => token.unifiedTokenId === unifiedToken.unifiedTokenId)
                        for (const token of tokensSameUnifiedTokenId) {
                            for (const chainId of Object.values(ChainId)) {
                                const platform = chainIdToPlatform(chainId)
                                const account = selectedAccounts[platform]
                                if (chainId !== token.chainId) continue
                                if (!account) continue
                                tokenItems.push({
                                    tokenId: token.tokenId,
                                    accountAddress: account.accountAddress,
                                    chainId: token.chainId,
                                    network: token.network,
                                })
                            }
                            return (
                                <UnifiedTokenCard2 
                                    isPressable
                                    onClick={() => {
                                        dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.TokenDetails))
                                        dispatch(
                                            setSelectedToken({
                                                type: SelectedTokenType.UnifiedToken,
                                                id: unifiedToken.unifiedTokenId,
                                            }))
                                        dispatch(setTokenItems(tokenItems))
                                    }}
                                    token={unifiedToken} 
                                    tokens={tokenItems}
                                    key={unifiedToken.unifiedTokenId}
                                />
                            )
                        }
                    })}
            </NomasCardBody>
        </NomasCard>
    )
}