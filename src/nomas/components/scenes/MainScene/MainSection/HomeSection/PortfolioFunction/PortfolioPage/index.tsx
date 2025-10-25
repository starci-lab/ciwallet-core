import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../../../../extends"
import { TokenList } from "./TokenList"

export const PortfolioPage = () => {
    return (
        <>
            <NomasCardHeader
                title="Portfolio"
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <div className="flex flex-col gap-4">
                        <TokenList />
                    </div>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}