import React from "react"
import { TokenCard2, UnifiedTokenCard2 } from "@/nomas/components"
import { selectSelectedAccounts, useAppSelector, setSelectedToken, SelectedTokenType, useAppDispatch, setPortfolioFunctionPage, PortfolioFunctionPage, type TokenItem, setTokenItems, selectNonUnifiedTokensTrackingOnly, selectUnifiedTokensTrackingOnly, selectTokensTracking, setSelectedChainId } from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const TokenList = () => {
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const network = useAppSelector((state) => state.persists.session.network)
    const dispatch = useAppDispatch()
    // non-unified tokens
    const trackingTokens = useAppSelector((state) => selectNonUnifiedTokensTrackingOnly(state.persists))
    const trackingUnifiedTokens = useAppSelector((state) => selectUnifiedTokensTrackingOnly(state.persists))
    const accounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const trackingTokensAll = useAppSelector((state) => selectTokensTracking(state.persists))
    return (
        <div className="p-0">
            {
                trackingUnifiedTokens.map((unifiedToken) => {
                    const tokenItems: Array<TokenItem> = []
                    const _tokens = trackingTokensAll.filter((token) => token.unifiedTokenId === unifiedToken.unifiedTokenId)
                    for (const token of _tokens) {
                        for (const chainId of Object.values(ChainId)) {
                            const platform = chainIdToPlatform(chainId)
                            const account = selectedAccounts[platform]
                            if (chainId !== token.chainId || token.network !== network) continue
                            if (!account) continue
                            tokenItems.push({
                                tokenId: token.tokenId,
                                accountAddress: account.accountAddress,
                                chainId: token.chainId,
                                network: token.network,
                                isToken2022: token.isToken2022,
                            })
                        }
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
                )
            }
            {
                trackingTokens.map((token) => {
                    const platform = chainIdToPlatform(token.chainId)
                    return <TokenCard2 
                        key={token.tokenId}
                        isPressable
                        onClick={() => {
                            dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.TokenDetails))
                            dispatch(setSelectedToken({
                                type: SelectedTokenType.Token,
                                id: token.tokenId,
                            }))
                            dispatch(setSelectedChainId(token.chainId))
                        }}
                        token={token}
                        chainId={token.chainId}
                        accountAddress={accounts[platform]?.accountAddress ?? ""}
                        network={network}
                    />
                })
            }
        </div>
    )
}