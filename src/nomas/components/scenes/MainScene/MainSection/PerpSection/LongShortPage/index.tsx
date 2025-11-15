import React from "react"
import { 
    NomasCardHeader, 
    NomasCardBody, 
    NomasInput,
    NomasCard,
    NomasCardVariant,
    PressableMotion, 
    NomasSpacer,
    NomasLink,
    TooltipTitle,
    NomasNumberTransparentInput,
} from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useMemo } from "react"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { CaretRightIcon, GearSixIcon } from "@phosphor-icons/react"
import { SizeDropdown } from "./SizeDropdown"
import { computeRatio } from "@ciwallet-sdk/utils"
import BN from "bn.js"
import Decimal from "decimal.js"

export const LongShortPage = () => {
    const dispatch = useAppDispatch()   
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const renderTitle = useMemo(() => {
        return orderSide === HyperliquidOrderSide.Buy ? "Long" : "Short" 
    }, [orderSide])
    const formik = usePlacePerpOrderFormik()
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const orderType = useAppSelector((state) => state.stateless.sections.perp.orderType)
    const orderTypeMetadata = useMemo(() => hyperliquidObj.getOrderTypeMetadata()[orderType], [orderType])
    const activeAssetCtx = useAppSelector((state) => state.stateless.sections.perp.activeAssetCtx)
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const currentPosition = useMemo(() => {
        return clearingHouseData?.assetPositions.find((assetPosition) => assetPosition.position.coin === 
            hyperliquidObj.getAssetMetadata(selectedAssetId)?.coin)
    }, [clearingHouseData, selectedAssetId])
    return (
        <>
            <NomasCardHeader
                title={
                    <div className="flex flex-col">
                        <div className="text-lg">
                            {renderTitle} {assetMetadata.name}
                        </div>
                        <NomasSpacer y={1} />
                        <div className="text-xs text-text-muted font-normal">
                        ${activeAssetCtx?.ctx.markPx}
                        </div>
                    </div>
                }
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody> 
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4 flex items-center justify-between gap-4">
                        <div className="flex justify-start flex-1">
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.MarginMode))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {isCross ? "Cross" : "Isolated"}
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-center flex-1">  
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.OrderType))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {orderTypeMetadata.name}
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-end flex-1">
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.Leverage))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {leverage}x
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
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
                        <NomasSpacer y={4} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Current Position" size="sm"/>
                            <div className="text-sm">
                                <div className="flex items-center gap-2">
                                    {
                                        `${
                                            new Decimal(
                                                currentPosition?.position.positionValue ?? "0"
                                            )
                                                .div(
                                                    new Decimal(activeAssetCtx?.ctx.markPx ?? "0")
                                                )
                                                .toFixed(5)
                                        } ${assetMetadata.coin}`
                                    }
                                </div>
                            </div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center gap-2 justify-between w-full">
                            <SizeDropdown />
                            <NomasNumberTransparentInput
                                value={`${formik.values.amount}`}
                                onValueChange={(value) => {
                                    formik.setFieldValue("amount", value)
                                }}
                                numericOnly
                                className="w-full"
                            />
                        </div>
                    </NomasCardBody>  
                </NomasCard>
            </NomasCardBody>
        </>
    )
}