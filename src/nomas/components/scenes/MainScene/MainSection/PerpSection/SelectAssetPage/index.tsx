import React from "react"
import { NomasCardHeader, NomasCardBody, NomasImage, NomasCard, NomasCardVariant, PressableMotion } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import { ChainId } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"

export const SelectAssetPage = () => {
    const dispatch = useAppDispatch()
    const depositAssetInfos = hyperliquidObj.getDepositAssetInfos()
    const hyperliquidDepositFormik = useHyperliquidDepositFormik()
    return (
        <>
            <NomasCardHeader
                title="Select Asset"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody scrollable scrollHeight={300} className="p-4">
                        {depositAssetInfos.map((depositAssetInfo) => (
                            <PressableMotion key={depositAssetInfo.asset} onClick={() => {
                                hyperliquidDepositFormik.setFieldValue("asset", depositAssetInfo.asset)
                                const refs = hyperliquidObj.getDepositAssetInfoByAsset(depositAssetInfo.asset).refs
                                if (refs.length > 0) {
                                    hyperliquidDepositFormik.setFieldValue("chainId", refs[0].chainId ?? ChainId.Arbitrum)
                                }
                                dispatch(setPerpSectionPage(PerpSectionPage.SourceChain))
                            }} className={
                                twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                    hyperliquidDepositFormik.values.asset === depositAssetInfo.asset ? "py-4 bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                            }>
                                <div className="flex items-center gap-2">
                                    <NomasImage src={depositAssetInfo.iconUrl ?? ""} className="w-10 h-10 rounded-full" />
                                    <div className="flex flex-col">
                                        <div className="text-sm text-text">{depositAssetInfo.name}</div>
                                        <div className="text-text-muted text-xs text-left">{depositAssetInfo.symbol}</div>
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