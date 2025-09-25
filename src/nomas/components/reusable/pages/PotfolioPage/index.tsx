import { NomasCard, NomasCardBody, NomasCardHeader } from "../../../extends"
import { SelectChainTab } from "../../../styled"
import { useAppSelector, useAppDispatch, setPotfolioChainId } from "@/nomas/redux"
import React from "react"
import { TokenList } from "./TokenList"

export const PotfolioPage = () => {
    const chainManager = useAppSelector((state) => state.chain.manager)
    const potfolioChainId = useAppSelector((state) => state.potfolio.chainId)
    const dispatch = useAppDispatch()
    return (
        <>
            <NomasCard asCore>
                <NomasCardHeader
                    title="Potfolio"
                    showBackButton
                    onBackButtonPress={() => {
                        console.log("ABC")
                    }}
                />
                <NomasCardBody>
                    <SelectChainTab
                        chainManager={chainManager}
                        isSelected={(chainId) => chainId === potfolioChainId}
                        onSelect={(chainId) => {
                            dispatch(setPotfolioChainId(chainId))
                        }}
                    />
                    <TokenList />
                </NomasCardBody>
            </NomasCard>
        </>
    )
}
