import React, { useEffect } from "react"
import { 
    NomasButton,
    NomasCard, 
    NomasCardBody, 
    NomasCardVariant, 
    NomasLink, 
    NomasSpacer, 
    TooltipTitle
} from "@/nomas/components"
import { PerpSectionPage, setOrderSide, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { GearSixIcon } from "@phosphor-icons/react"
import { AssetPositions } from "./AssetPositions"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"

export const PerpTrade = () => {
    const dispatch = useAppDispatch()
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const formik = usePlacePerpOrderFormik()
    useEffect(() => {
        if (!clearingHouseData) return
        formik.setFieldValue("balanceAmount", clearingHouseData?.marginSummary.accountValue || "0")
    }, [clearingHouseData])
    return (
        <div>
            <AssetPositions />
            <NomasSpacer y={6} />
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4">
                    <div className="flex items-center gap-2 justify-between">
                        <TooltipTitle title="Available to Trade" size="sm"/>
                        <div className="text-sm">
                            <div className="flex items-center gap-2">
                                ${clearingHouseData?.marginSummary.totalRawUsd}
                                <NomasLink onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                                }}>
                                    <GearSixIcon className="size-5 text-text-muted" />
                                </NomasLink>
                            </div>
                        </div>
                    </div>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <div className="flex items-center gap-4">
                <NomasButton noShadow xlSize className="bg-bullish text-text hover:bg-bullish-hover flex-1" onClick={() => {
                    dispatch(setOrderSide(HyperliquidOrderSide.Buy))
                    dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                }}> 
                    Long
                </NomasButton>
                <NomasButton noShadow xlSize className="bg-bearish text-text hover:bg-bearish-hover flex-1" onClick={() => {
                    dispatch(setOrderSide(HyperliquidOrderSide.Sell))
                    dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                }}>
                    Short
                </NomasButton>
            </div>
        </div>
    )
}