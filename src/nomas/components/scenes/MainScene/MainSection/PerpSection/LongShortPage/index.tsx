import React, { useEffect } from "react"
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
    NomasInvalidVariant,
} from "@/nomas/components"
import { PerpSectionPage, selectMarginTableByUniverseId, setPerpSectionPage, setPositionAssetId, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useMemo } from "react"
import { HyperliquidOrderSide, HyperliquidOrderType } from "@ciwallet-sdk/classes"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { CaretRightIcon, GearSixIcon } from "@phosphor-icons/react"
import Decimal from "decimal.js"
import { computePercentage, roundNumber } from "@/nomas/utils"
import { assetsConfig } from "@/nomas/resources"
import { twMerge } from "tailwind-merge"

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
    const userFees = useAppSelector((state) => state.stateless.sections.perp.userFees)
    const marginTable = useAppSelector((state) => selectMarginTableByUniverseId(state.stateless.sections))
    const activeAssetData = useAppSelector((state) => state.stateless.sections.perp.activeAssetData)
    const availableToTrade = useMemo(() => {
        return orderSide === HyperliquidOrderSide.Buy ? activeAssetData?.availableToTrade[0] : activeAssetData?.availableToTrade[1]
    }, [activeAssetData, orderSide])
    const takerFee = useMemo(() => {
        return new Decimal(userFees?.feeSchedule.cross ?? 0).mul(new Decimal(1).sub(userFees?.activeReferralDiscount ?? 0)).toNumber()
    }, [userFees])
    const positionValueInUsdc = useMemo(() => {
        return new Decimal(formik.values.amount || 0)
            .mul(leverage)
    }, [formik.values.amount, leverage])
    const makerFee = useMemo(() => {
        return new Decimal(userFees?.feeSchedule.add ?? 0).mul(new Decimal(1).sub(userFees?.activeReferralDiscount ?? 0)).toNumber()
    }, [userFees])

    useEffect(() => {
        if (!availableToTrade) return
        formik.setFieldValue("balanceAmount", availableToTrade)
    }, [availableToTrade])
    
    // to-do: require support for corresponding calculation for corresponding chain
    const liquidationPrice = useMemo(() => {
        const markPx = new Decimal(activeAssetCtx?.ctx.markPx ?? 0)
        const positionValue = positionValueInUsdc.div(markPx)
        // 1. Determine l = 1 / maintenanceLeverage
        let l = new Decimal(0)
        for (const tier of marginTable?.marginTiers || []) {
            if (positionValueInUsdc.gte(tier.lowerBound)) {
                l = new Decimal(1).div(tier.maxLeverage)
            }
        }
        const side = orderSide === HyperliquidOrderSide.Buy ? new Decimal(1) : new Decimal(-1)
        let marginAvailable = new Decimal(0)
        // 2. CROSS
        if (isCross) {
            marginAvailable =
            new Decimal(clearingHouseData?.crossMarginSummary.totalRawUsd ?? 0)
                .sub(clearingHouseData?.crossMaintenanceMarginUsed ?? 0)
        }
        // 3. ISOLATED
        else {
            const isolatedMargin = positionValueInUsdc.div(leverage)
            const maintenanceMargin = positionValueInUsdc.mul(l)
            marginAvailable = isolatedMargin.sub(maintenanceMargin)
        }
        // 4. Final liquidation formula
        const px = new Decimal(activeAssetCtx?.ctx.markPx ?? 0)
        const liq = px.sub(
            side.mul(marginAvailable.div(positionValue))
                .div(new Decimal(1).sub(l.mul(side)))
        )
        return roundNumber(liq.toNumber(), 3)
    }, [
        activeAssetCtx?.ctx.markPx,
        leverage,
        clearingHouseData?.marginSummary.accountValue,
        clearingHouseData?.crossMaintenanceMarginUsed,
        leverage,
        orderSide,
        formik.values.amount
    ])
    const isLimitExceed = useMemo(() => {
        return new Decimal(formik.values.limitPrice).gt(new Decimal(activeAssetCtx?.ctx.markPx ?? 0))
    }, [formik.values.limitPrice, activeAssetCtx?.ctx.markPx])

    useEffect(() => {
        if (!clearingHouseData) return
        formik.setFieldValue("balanceAmount", clearingHouseData?.marginSummary.accountValue || "0")
    }, [clearingHouseData])
    return (
        <>
            <NomasCardHeader
                title={
                    <div className="flex flex-col">
                        <div className="text-lg">
                            {renderTitle} {assetMetadata.coin}
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
                                ${availableToTrade}
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
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        { 
                            orderType === HyperliquidOrderType.Limit && (
                                <>
                                    <NomasInput
                                        value={formik.values.limitPrice}
                                        textAlign="right"
                                        onValueChange={(value) => {
                                            formik.setFieldValue("limitPrice", value)
                                        }}
                                        prefixIcon={
                                            <div className="text-sm text-text-muted">
                                    Limit Price
                                            </div>
                                        }
                                        numericOnly
                                        invalidVariant={NomasInvalidVariant.Warning}
                                        errorMessage={
                                            orderSide === HyperliquidOrderSide.Buy ?
                                                "Limit price is above the mark price and may execute immediately"
                                                :
                                                "Limit price is below the mark price and may execute immediately"
                                        }
                                        isInvalid={isLimitExceed}
                                        className="w-full"
                                    />
                                    <NomasSpacer y={4} />
                                </>
                            )
                        }
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
                            onBlur={() => {
                                formik.setFieldTouched("amount")
                            }}
                            errorMessage={formik.errors.amount}
                            isInvalid={!!(formik.errors.amount && formik.touched.amount)}
                            numericOnly
                            className="w-full"
                        />
                        <NomasSpacer y={4} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Liquidation Price" size="xs"/>
                            <div className="text-xs text-bearish">
                                {
                                    `${liquidationPrice} USDC`
                                }
                            </div>
                        </div>
                        <NomasSpacer y={2} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Position Value" size="xs"/>
                            <div className="text-xs">
                                {
                                    `${roundNumber(positionValueInUsdc.toNumber())} USDC`
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
                <PressableMotion onClick={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.TakeProfitStopLoss))
                }}>
                    <NomasCard variant={NomasCardVariant.Dark} isInner>
                        <NomasCardBody className="p-4 flex items-center justify-between">
                            <TooltipTitle title="TP/SL" size="xs"/>
                            <div className="text-xs">
                                <span className={twMerge(formik.values.takeProfit && "text-bullish")}>
                                    {formik.values.takeProfit || "--"}
                                </span>
                                /
                                <span className={twMerge(formik.values.stopLoss && "text-bearish")}>
                                    {formik.values.stopLoss || "--"}
                                </span>
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </PressableMotion>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton 
                    xlSize 
                    className="w-full" onClick={
                        async () => {
                            await formik.submitForm()
                            switch (orderType) {
                            case HyperliquidOrderType.Limit:
                                dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                                break
                            case HyperliquidOrderType.Market:
                                dispatch(setPositionAssetId(selectedAssetId))
                                dispatch(setPerpSectionPage(PerpSectionPage.Position))
                                break
                            }
                        }} 
                    isLoading={formik.isSubmitting}>
                    Place Order
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}