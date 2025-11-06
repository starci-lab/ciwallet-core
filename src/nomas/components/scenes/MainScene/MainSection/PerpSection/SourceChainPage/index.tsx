import React, { useMemo } from "react"
import { NomasCardHeader, NomasCardBody, NomasImage, NomasCard, NomasCardVariant, PressableMotion } from "@/nomas/components"
import { PerpSectionPage, setDepositSourceChainId, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj, hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import { ChainId } from "@ciwallet-sdk/types"

export const SourceChainPage = () => {
    const dispatch = useAppDispatch()
    const depositSourceChainId = useAppSelector((state) => state.stateless.sections.perp.depositSourceChainId)
    const depositCurrentAsset = useAppSelector((state) => state.stateless.sections.perp.depositCurrentAsset)
    const refs = useMemo(
        () => 
            hyperliquidObj.getDepositAssetInfoByAsset(depositCurrentAsset).refs.map((ref) => chainManagerObj.getChainById(ref.chainId)),
        [depositCurrentAsset])

    return (
        <>
            <NomasCardHeader
                title="Select Source Chain"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody scrollable scrollHeight={300} className="p-4">
                        {refs.map((chainInfo) => (
                            <PressableMotion key={chainInfo?.id ?? ChainId.Arbitrum} onClick={() => {
                                dispatch(setDepositSourceChainId(chainInfo?.id ?? ChainId.Arbitrum))
                                dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                            }} className={
                                twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                    depositSourceChainId === (chainInfo?.id ?? ChainId.Arbitrum) ? "py-4 bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                            }>
                                <div className="flex items-center gap-2">
                                    <NomasImage src={chainInfo?.iconUrl ?? ""} className="w-10 h-10 rounded-full" />
                                    <div className="flex flex-col">
                                        <div className="text-sm text-text">{chainInfo?.name ?? ""}</div>
                                    </div>
                                </div>
                            </PressableMotion>
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}