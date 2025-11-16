import React, { useMemo } from "react"
import { NomasCardHeader, NomasCardBody, NomasCard, NomasCardVariant, PerpChart, NomasSpacer, TooltipTitle, NomasLink, PressableMotion, NomasCardFooter, NomasButton } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, setPositionUseUsdc, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import Decimal from "decimal.js"
import { computePercentage, roundNumber } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import { ArrowsLeftRightIcon, CaretRightIcon } from "@phosphor-icons/react"

export const PositionPage = () => {
    const dispatch = useAppDispatch()
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const positionAssetId = useAppSelector((state) => state.stateless.sections.perp.positionAssetId)
    const positionUseUsdc = useAppSelector((state) => state.stateless.sections.perp.positionUseUsdc)
    const assetPosition = useMemo(() => {
        return clearingHouseData?.assetPositions.find((assetPosition) => assetPosition.position.coin === hyperliquidObj.getAssetMetadata(positionAssetId).coin)
    }, [clearingHouseData, positionAssetId])
    const positionAssetCtx = useAppSelector((state) => state.stateless.sections.perp.positionAssetCtx)
    const positionCandleSnapshots = useAppSelector((state) => state.stateless.sections.perp.positionCandleSnapshots)
    const positionAssetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(positionAssetId), [positionAssetId])

    const [dailyChangePercentage, isDailyChangePercentagePositive] = useMemo(() => {
        const markPx = new Decimal(positionAssetCtx?.ctx.markPx ?? 0)
        const prevMarkPx = new Decimal(positionAssetCtx?.ctx.prevDayPx ?? 0)
        const dailyChangePercentage = roundNumber(markPx.sub(prevMarkPx).div(prevMarkPx).mul(100).toNumber())
        const isPositive = dailyChangePercentage > 0
        return [`${isPositive ? "+" : "-"}${Math.abs(dailyChangePercentage)}%`, isPositive]
    }, [positionAssetCtx, positionCandleSnapshots])
    const [priceDailyChange, isPriceDailyChangePositive] = useMemo(() => {
        const markPx = new Decimal(positionAssetCtx?.ctx.markPx ?? 0)
        const prevMarkPx = new Decimal(positionAssetCtx?.ctx.prevDayPx ?? 0)
        const priceDailyChange = roundNumber(markPx.sub(prevMarkPx).toNumber())
        const isPositive = priceDailyChange > 0
        return [`${isPositive ? "+" : "-"}$${Math.abs(priceDailyChange)}`, isPositive]
    }, [positionAssetCtx, positionCandleSnapshots])

    const [unrealizedPnl, isUnrealizedPnlPositive] = useMemo(() => {
        const decimalValue = new Decimal(assetPosition?.position.unrealizedPnl ?? 0)
        const isPositive = decimalValue.gt(0)
        const sign = decimalValue.gt(0) ? "+" : "-"
        const unrealizedPnl = decimalValue.abs()
        if (unrealizedPnl.lt(0.01)) {
            return [`${sign}<$0.01`, isPositive]
        } else {
            return [`${sign}$${roundNumber(unrealizedPnl.abs().toNumber(), 2)}`, isPositive]
        }
    }, [assetPosition])
    const [roi, isRoiPositive] = useMemo(() => {
        const decimalValue = new Decimal(assetPosition?.position.unrealizedPnl ?? 0)
        const isPositive = decimalValue.gt(0)
        const sign = decimalValue.gt(0) ? "+" : "-"
        const roi = computePercentage(decimalValue.toNumber(), assetPosition?.position.marginUsed ?? 0)
        if (new Decimal(roi).lt(0.01)) {
            return [`${sign}<0.01%`, isPositive]
        } else {
            return [`${sign}${roundNumber(Math.abs(roi), 2)}%`, isPositive]
        }
    }, [assetPosition])
    const openOrders = useAppSelector((state) => state.stateless.sections.perp.openOrders)
    const takeProfit = useMemo(() => {
        const order = openOrders?.
            find((order) => 
                order.coin === hyperliquidObj.getAssetMetadata(positionAssetId).coin &&
                (order.orderType === "Take Profit Limit" || order.orderType === "Take Profit Market")
            )
        return order?.triggerPx
    }, [openOrders, positionAssetId])
    const stopLoss = useMemo(() => {
        const order = openOrders?.
            filter((order) => order.coin === hyperliquidObj.getAssetMetadata(positionAssetId).coin)
            .find((order) => 
                order.orderType === "Stop Limit" || order.orderType === "Stop Market"
            )
        return order?.triggerPx
    }, [openOrders, positionAssetId])
    const isLong = useMemo(() => {
        return assetPosition?.position.szi && new Decimal(assetPosition?.position.szi).gt(0)
    }, [assetPosition])

    const [fundingPayment, isFundingPaymentPositive] = useMemo(() => {
        const decimalValue = new Decimal(assetPosition?.position.cumFunding.allTime ?? 0).mul(new Decimal(-1))
        const isPositive = decimalValue.gt(0)
        const sign = decimalValue.gt(0) ? "+" : "-"
        const fundingPayment = decimalValue.abs()
        if (fundingPayment.lt(0.01)) {
            return [`${sign}<$0.01`, isPositive]
        } else {
            return [`${sign}$${roundNumber(fundingPayment.abs().toNumber(), 2)}`, isPositive]
        }
    }, [assetPosition])
    return (
        <>
            <NomasCardHeader
                title={
                    `${isLong ? "Long" : "Short"} Position ${positionAssetMetadata.coin}`
                }
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody> 
                <div>
                    <div className="text-2xl font-bold">
                    ${positionAssetCtx?.ctx.markPx}
                    </div>
                    <NomasSpacer y={2} />
                    <div className="flex items-center gap-2">
                        <div className={twMerge("text-xs text-text-muted", isPriceDailyChangePositive ? "text-bullish" : "text-bearish")}>
                            {priceDailyChange}
                        </div>
                        <div className={twMerge("text-xs text-text-muted", 
                            isDailyChangePercentagePositive ? "text-bullish bg-bullish/40 rounded-full px-2 py-1" : "text-bearish bg-bearish/40 rounded-full px-2 py-1")}>
                            {dailyChangePercentage}
                        </div>
                    </div>
                </div>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <PerpChart candleSnapshots={positionCandleSnapshots} />
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                            isUnrealizedPnlPositive ? "text-bullish" : "text-bearish"
                        )}>
                            <TooltipTitle title="Unrealized PNL" size="xs"/>
                            <div className="text-xs">
                                {unrealizedPnl}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                            isRoiPositive ? "text-bullish" : "text-bearish"
                        )}>
                            <TooltipTitle title="ROI" size="xs"/>
                            <div className="text-xs">
                                {roi}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between"
                        )}>
                            <TooltipTitle title="Size" size="xs"/>
                            <div className="flex items-center gap-2">
                                <div className="text-xs">
                                    {positionUseUsdc ? `${assetPosition?.position.szi} ${assetPosition?.position.coin}` : 
                                        `${roundNumber(    
                                            new Decimal(assetPosition?.position.positionValue ?? 0)
                                                .div(new Decimal(assetPosition?.position.leverage.value ?? 0))
                                                .toNumber()
                                            , 2
                                        )} USDC`}
                                </div>
                                <NomasLink onClick={() => {
                                    dispatch(setPositionUseUsdc(!positionUseUsdc))
                                }}>
                                    <ArrowsLeftRightIcon className="size-4 text-text-muted" />
                                </NomasLink>
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between"
                        )}>
                            <TooltipTitle title="Margin (Isolated)" size="xs"/>
                            <div className="flex items-center gap-2">
                                <div className="text-xs">
                                    ${assetPosition?.position.marginUsed}
                                </div>
                                <NomasLink onClick={() => {
                                    dispatch(setPositionUseUsdc(!positionUseUsdc))
                                }}>
                                    <CaretRightIcon  className="size-4 text-text-muted" />
                                </NomasLink>
                            </div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                            isLong ? "text-bullish" : "text-bearish"
                        )}>
                            <TooltipTitle title="Direction" size="xs"/>
                            <div className="text-xs">
                                {isLong ? "Long" : "Short"} {assetPosition?.position.leverage.value}x
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Entry Price" size="xs"/>
                            <div className="text-xs">
                                ${assetPosition?.position.entryPx}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Liquidation Price" size="xs"/>
                            <div className="text-xs">
                                ${roundNumber(new Decimal(assetPosition?.position.liquidationPx ?? 0).toNumber(), 2)}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                            isFundingPaymentPositive ? "text-bullish" : "text-bearish"
                        )}>
                            <TooltipTitle title="Funding Payment" size="xs"/>
                            <div className="text-xs">
                                {fundingPayment}
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
                                <span className={twMerge(takeProfit && "text-bullish")}>
                                    {takeProfit || "--"}
                                </span>
                                /
                                <span className={twMerge(stopLoss && "text-bearish")}>
                                    {stopLoss || "--"}
                                </span>
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </PressableMotion>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    onClick={() => {
                        dispatch(setPerpSectionPage(PerpSectionPage.ClosePositionConfirmation))
                    }}>
                    Close {isLong ? "Long" : "Short"}
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}