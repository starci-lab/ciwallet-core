import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasLink } from "../../../../../../extends"
import { TokenList } from "./TokenList"
import { PortfolioFunctionPage, setPortfolioFunctionPage, useAppDispatch } from "@/nomas/redux"
import { GearSixIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { TooltipTitle } from "@/nomas/components"

export const PortfolioPage = () => {
    const dispatch = useAppDispatch()
    return (
        <>
            <NomasCardHeader
                title="Portfolio"
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between p-4 pb-2 w-full">
                            <TooltipTitle title="Crypto" size="sm"/>
                            <div className="flex items-center gap-4">
                                <NomasLink onClick={() => {
                                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.SearchToken))
                                }}>
                                    <MagnifyingGlassIcon />
                                </NomasLink>
                                <NomasLink>
                                    <GearSixIcon />
                                </NomasLink>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <TokenList />
                    </div>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}