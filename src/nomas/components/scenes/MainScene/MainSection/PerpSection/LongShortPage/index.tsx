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
    NomasCardFooter,
    NomasButton,
    NomasImage,
} from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useMemo } from "react"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { CaretRightIcon, GearSixIcon } from "@phosphor-icons/react"
import Decimal from "decimal.js"
import { computePercentage } from "@/nomas/utils"
import { assetsConfig } from "@/nomas/resources"

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
    const userFees = useAppSelector((state) => state.stateless.sections.perp.userFees)
    const takerFee = useMemo(() => {
        return new Decimal(userFees?.feeSchedule.cross ?? 0).mul(new Decimal(1).sub(userFees?.activeReferralDiscount ?? 0)).toNumber()
    }, [userFees])
    const makerFee = useMemo(() => {
        return new Decimal(userFees?.feeSchedule.add ?? 0).mul(new Decimal(1).sub(userFees?.activeReferralDiscount ?? 0)).toNumber()
    }, [userFees])
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
                                <div className="text-xs">
                                    {isCross ? "Cross" : "Isolated"}
                                </div>
                                <CaretRightIcon className="size-3 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-center flex-1">  
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.OrderType))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-xs">
                                    {orderTypeMetadata.name}
                                </div>
                                <CaretRightIcon className="size-3 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-end flex-1">
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.Leverage))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-xs">
                                    {leverage}x
                                </div>
                                <CaretRightIcon className="size-3 text-text-muted" />
                            </PressableMotion>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Available to Trade" size="xs"/>
                            <div className="text-xs">
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
                            <TooltipTitle title="Current Position" size="xs"/>
                            <div className="text-xs">
                                <div className="flex items-center gap-2">
                                    {
                                        `${
                                            currentPosition?.position.positionValue
                                        } USDC`
                                    }
                                </div>
                            </div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <NomasInput
                            value={formik.values.amount}
                            textAlign="right"
                            onValueChange={(value) => {
                                formik.setFieldValue("amount", value)
                            }}
                            prefixIcon={
                                <div className="text-sm text-text-muted">
                                    Pay
                                </div>
                            }
                            numericOnly
                            className="w-full"
                        />
                        <NomasSpacer y={4} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Liquidation Price" size="xs"/>
                            <div className="text-xs text-bearish">
                                {
                                    `$${new Decimal(activeAssetCtx?.ctx.markPx ?? "0").mul(1.05).toString()} USDC`
                                }
                            </div>
                        </div>
                        <NomasSpacer y={2} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Order Value" size="xs"/>
                            <div className="text-xs">
                                {
                                    `$${new Decimal(activeAssetCtx?.ctx.markPx ?? "0").mul(0.95).toString()} USDC`
                                }
                            </div>
                        </div>
                        <NomasSpacer y={2} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Fees" size="xs"/>
                            <div className="flex items-center gap-2">
                                <NomasImage 
                                    src={assetsConfig().hyperliquid.logo}
                                    alt={assetMetadata.coin}
                                    className="w-4 h-4"
                                />
                                <div className="text-xs">
                                    {
                                        `${computePercentage(takerFee, 1, 10)}%/${computePercentage(makerFee, 1, 10)}%`
                                    }
                                </div>
                            </div>
                        </div>
                    </NomasCardBody>  
                </NomasCard>
                <NomasSpacer y={4} />
                <PressableMotion>
                    <NomasCard variant={NomasCardVariant.Dark} isInner>
                        <NomasCardBody className="p-4 flex items-center justify-between">
                            <TooltipTitle title="Take Profit/Stop Loss" size="xs"/>
                            <div className="text-xs">
                            N/A
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </PressableMotion>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton xlSize className="w-full" onClick={() => {
                    formik.submitForm()
                }}>
                    Place Order
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}