import { NomasCard, NomasCardBody, NomasCardVariant, NomasCheckbox, NomasInput, NomasSlider, NomasSpacer, NomasTab, PressableMotion, TooltipTitle } from "@/nomas/components"
import React from "react"
import { PerpSectionPage, setPerpSectionPage, setTradeType, TradeType } from "@/nomas/redux"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"

export const PerpTrade = () => {
    const dispatch = useAppDispatch()
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const tradeType = useAppSelector((state) => state.stateless.sections.perp.tradeType)
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
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
                value={tradeType}
                onValueChange={(value) => dispatch(setTradeType(value as TradeType))}
                tabs={[{
                    value: TradeType.Buy,
                    label: "Buy/Long",
                    className: tradeType === TradeType.Buy ? "transition-colors duration-300 ease-in-out bg-bullish" : undefined,
                },
                {
                    value: TradeType.Sell,
                    label: "Sell/Short",
                    className: tradeType === TradeType.Sell ? "transition-colors duration-300 ease-in-out bg-bearish" : undefined,
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
                value={"0"}
                prefixIcon={<div className="text-sm">Size</div>}
                textAlign="right"
                onValueChange={(value) => {}}
                numericOnly
                className="w-full"
            />
            <NomasSpacer y={4} />
            <div className="flex items-center justify-between gap-4 w-full">
                <NomasSlider
                    min={1}
                    max={100}
                    defaultValue={1}
                    value={1}
                    onValueChange={(value) => {}}
                    className="w-full flex-1"
                />
                <NomasInput
                    value={"100%"}
                    textAlign="right"
                    onValueChange={(value) => {}}
                    numericOnly
                    className="w-20 max-w-20"
                />
            </div>
            <NomasSpacer y={4} />
            <div className="flex items-center gap-2">
                <NomasCheckbox 
                    checked={false}
                    onCheckedChange={(checked) => {}}
                />
                <div className="text-sm">Reduce Only</div>
            </div>
            <NomasSpacer y={2} />
            <div className="flex items-center gap-2">
                <NomasCheckbox 
                    checked={false}
                    onCheckedChange={(checked) => {}}
                />
                <div className="text-sm">Take Profit & Stop Loss</div>
            </div>
        </div>
    )
}