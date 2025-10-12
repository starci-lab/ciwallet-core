import React from "react"
import { TokenCard2 } from "../../../../../TokenCard2"
import { selectTokens, selectSelectedAccount, setHomeFunction, setSelectedTokenId, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../../../../extends"
import { HomeFunction } from "@/nomas/redux"

export const PortfolioFunction = () => {
    const dispatch = useAppDispatch()
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const chainId = useAppSelector((state) => state.stateless.sections.home.portfolioSelectedChainId)
    const account = useAppSelector((state) => selectSelectedAccount(state.persists))
    const network = useAppSelector((state) => state.persists.session.network)
    if (!account) throw new Error("Account not found")
    return (
        <>
            <NomasCardHeader
                title="Portfolio"
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <div className="flex flex-col gap-4">
                        {tokens.map((token) => {
                            return <TokenCard2 
                                chainId={chainId} 
                                token={token} 
                                key={token.tokenId}
                                accountAddress={account?.accountAddress} 
                                network={network} 
                                onClick={() => {
                                    dispatch(setHomeFunction(HomeFunction.Token))
                                    dispatch(setSelectedTokenId(token.tokenId))
                                }}
                            />
                        })}
                    </div>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}