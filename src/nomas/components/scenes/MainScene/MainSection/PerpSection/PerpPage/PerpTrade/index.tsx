import React, { useEffect } from "react"
import { 
    NomasButton,
    NomasCard, 
    NomasCardBody, 
    NomasCardVariant, 
    NomasCheckbox, 
    NomasInput, 
    NomasSlider, 
    NomasSpacer, 
    NomasTab, 
    PressableMotion, 
    TooltipTitle
} from "@/nomas/components"
import { PerpSectionPage, setOrderSide, setPerpSectionPage } from "@/nomas/redux"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { HyperliquidOrderSide, HyperliquidOrderType } from "@ciwallet-sdk/classes"

export const PerpTrade = () => {
    const dispatch = useAppDispatch()
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const formik = usePlacePerpOrderFormik()
    const orderType = useAppSelector((state) => state.stateless.sections.perp.orderType)
    useEffect(() => {
        if (!clearingHouseData) return
        formik.setFieldValue("balanceAmount", clearingHouseData?.marginSummary.accountValue || "0")
    }, [clearingHouseData])
    const renderOrderType = () => {
        switch (orderType) {
        case HyperliquidOrderType.Market:
            return "Market"
        case HyperliquidOrderType.Limit:
            return "Limit"  
        case HyperliquidOrderType.StopLimit:
            return "Stop Limit"
        case HyperliquidOrderType.StopMarket:
            return "Stop Market"
        case HyperliquidOrderType.TakeMarket:
            return "Take Market"
        case HyperliquidOrderType.TWAP:
            return "TWAP"
        case HyperliquidOrderType.Scale:
            return "Scale"
        }
    }
    return (
        <div>
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4">
                    <div className="flex items-center gap-1">
                        <PressableMotion
                            className="flex items-center w-full"
                            onClick={() => {
                                dispatch(setPerpSectionPage(PerpSectionPage.MarginMode))
                            }}
                        >
                            <div className="text-sm">{isCross ? "Cross" : "Isolated"}</div>
                            <CaretRightIcon className="size-4 text-text-muted" />
                        </PressableMotion>
                        <PressableMotion
                            className="flex items-center w-full"
                            onClick={() => {
                                dispatch(setPerpSectionPage(PerpSectionPage.OrderType))
                            }}
                        >
                            <div className="text-sm">{renderOrderType()}</div>
                            <CaretRightIcon className="size-4 text-text-muted" />
                        </PressableMotion>
                        <PressableMotion
                            className="flex items-center gap-1"
                            onClick={() => {
                                dispatch(setPerpSectionPage(PerpSectionPage.Leverage))
                            }}
                        >
                            <div className="text-sm">{leverage}x</div>
                            <CaretRightIcon className="size-4 text-text-muted" />
                        </PressableMotion>
                    </div>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={4} />
            <NomasTab 
                value={orderSide}
                onValueChange={(value) => dispatch(setOrderSide(value as HyperliquidOrderSide))}
                tabs={[{
                    value: HyperliquidOrderSide.Buy,
                    label: "Buy/Long",
                    className: orderSide === HyperliquidOrderSide.Buy ? "transition-colors duration-300 ease-in-out bg-bullish" : undefined,
                },
                {
                    value: HyperliquidOrderSide.Sell,
                    label: "Sell/Short",
                    className: orderSide === HyperliquidOrderSide.Sell ? "transition-colors duration-300 ease-in-out bg-bearish" : undefined,
                },
                ]}
            />
            <NomasSpacer y={4} />
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4">
                    <div className="flex items-center justify-between gap-1">
                        <TooltipTitle title="Available to Trade" size="sm" />
                        <div className="text-sm">{clearingHouseData?.marginSummary.accountValue}</div>
                    </div>
                    <NomasSpacer y={4} />
                    <div className="flex items-center justify-between gap-1">
                        <TooltipTitle title="Current Position" size="sm" />
                        <div className="text-sm">0.0000 ETH</div>
                    </div>
                </NomasCardBody> 
            </NomasCard>
            <NomasSpacer y={4} />
            <NomasInput
                value={formik.values.amount}
                prefixIcon={<div className="text-sm">Size</div>}
                textAlign="right"
                onValueChange={(value) => formik.setFieldValue("amount", value)}
                numericOnly
                onBlur={() => formik.setFieldTouched("amount")}
                isInvalid={!!(formik.touched.amount && formik.errors.amount)}
                isRequired
                errorMessage={formik.errors.amount}
                className="w-full"
            />
            <NomasSpacer y={4} />
            <div className="flex items-center justify-between gap-4 w-full">
                <NomasSlider
                    min={1}
                    max={100}
                    defaultValue={1}
                    value={[formik.values.amountPercentage]}
                    onValueChange={(value) => formik.setFieldValue("amountPercentage", value)}
                    className="w-full flex-1"
                />
                <NomasInput
                    value={formik.values.amountPercentage.toString()}
                    textAlign="right"
                    postfixIcon={<div className="text-sm">%</div>}
                    onBlur={() => formik.setFieldTouched("amountPercentage")}
                    onValueChange={(value) => formik.setFieldValue("amountPercentage", value)}
                    isRequired
                    numericOnly
                    className="w-25 max-w-25"
                />
            </div>
            <NomasSpacer y={4} />
            <div className="flex items-center gap-2">
                <NomasCheckbox 
                    checked={formik.values.isReduceOnly}
                    onCheckedChange={(checked) => formik.setFieldValue("isReduceOnly", checked)}
                />
                <div className="text-sm">Reduce Only</div>
            </div>
            <NomasSpacer y={2} />
            <div className="flex items-center gap-2">
                <NomasCheckbox 
                    checked={formik.values.isTakeProfitAndStopLoss}
                    onCheckedChange={(checked) => formik.setFieldValue("isTakeProfitAndStopLoss", checked)}
                />
                <div className="text-sm">Take Profit & Stop Loss</div>
            </div>  
            {formik.values.isTakeProfitAndStopLoss && (
                <>
                    <NomasSpacer y={6} />
                    <div className="flex items-center gap-2">
                        <NomasInput
                            value={formik.values.takeProfit.toString()}
                            textAlign="right"
                            onBlur={() => formik.setFieldTouched("takeProfit")}
                            onValueChange={(value) => formik.setFieldValue("takeProfit", value)}
                            isRequired
                            numericOnly
                            className="flex-1"
                        />
                        <NomasInput
                            value={formik.values.takeProfitPercentage.toString()}
                            textAlign="right"
                            postfixIcon={<div className="text-sm">%</div>}
                            onBlur={() => formik.setFieldTouched("takeProfitPercentage")}
                            onValueChange={(value) => formik.setFieldValue("takeProfitPercentage", value)}
                            isRequired
                            numericOnly
                            className="flex-1"
                        />
                    </div>
                    <NomasSpacer y={4} />
                    <div className="flex items-center gap-2">
                        <NomasInput
                            value={formik.values.stopLoss.toString()}
                            textAlign="right"
                            onBlur={() => formik.setFieldTouched("stopLoss")}
                            onValueChange={(value) => formik.setFieldValue("stopLoss", value)}
                            isRequired
                            numericOnly
                            className="flex-1"
                        />
                        <NomasInput
                            value={formik.values.stopLossPercentage.toString()}
                            textAlign="right"
                            postfixIcon={<div className="text-sm">%</div>}
                            onBlur={() => formik.setFieldTouched("stopLossPercentage")}
                            onValueChange={(value) => formik.setFieldValue("stopLossPercentage", value)}
                            isRequired
                            numericOnly
                            className="flex-1"
                        />  
                    </div>
                </>
            )}
            <NomasSpacer y={6} />
            <NomasButton
                xlSize
                className="w-full"
                isDisabled={!formik.isValid}
                isLoading={formik.isSubmitting}
                onClick={() => formik.submitForm()}
            >
                Place Order
            </NomasButton>
        </div>
    )
}