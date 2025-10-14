import React from "react"
import { selectSelectedAccount, useAppSelector, selectTokens } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../../../extends"
import { TokenCard2 } from "@/nomas/components/reusable/TokenCard2"

export const PortfolioFunction = () => {
    const account = useAppSelector((state) => selectSelectedAccount(state.persists))
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const chainId = useAppSelector((state) => state.persists.session.chainId)
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
                            />
                        })}
                    </div>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}