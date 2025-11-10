import React, { useMemo } from "react"
import { NomasCardHeader, NomasCardBody, NomasImage, NomasCard, NomasCardVariant, PressableMotion } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj, hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import { ChainId } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"

export const SourceChainPage = () => {
    const dispatch = useAppDispatch()
    const hyperliquidDepositFormik = useHyperliquidDepositFormik()
    const refs = useMemo(
        () => 
            hyperliquidObj.getDepositAssetInfoByAsset(hyperliquidDepositFormik.values.asset).refs.map((ref) => chainManagerObj.getChainById(ref.chainId)),
        [hyperliquidDepositFormik.values.asset])

    return (
        <>
            <NomasCardHeader
                title="Select Source Chain"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody scrollable scrollHeight={300} className="p-4">
                        {refs.map((chainInfo) => (
                            <PressableMotion key={chainInfo?.id ?? ChainId.Arbitrum} onClick={() => {
                                hyperliquidDepositFormik.setFieldValue("chainId", chainInfo?.id ?? ChainId.Arbitrum)
                                dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                            }} className={
                                twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                    hyperliquidDepositFormik.values.chainId === (chainInfo?.id ?? ChainId.Arbitrum) ? "py-4 bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
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