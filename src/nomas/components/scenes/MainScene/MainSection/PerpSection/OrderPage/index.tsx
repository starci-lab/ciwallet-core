import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasImage, NomasSpacer, NomasButton, TooltipTitle, PressableMotion    } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch } from "@/nomas/redux"
import { useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"
import { Decimal } from "decimal.js"
import { roundNumber } from "@/nomas/utils"
export const OrderPage = () => {
    const dispatch = useAppDispatch()
    const selectedOrder = useAppSelector((state) => state.stateless.sections.perp.selectedOrder)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadataByCoin(selectedOrder?.coin ?? ""), [selectedOrder])
    const isLong = useMemo(() => {
        return selectedOrder?.side === "B"
    }, [selectedOrder])
    const value = useMemo(() => {
        return new Decimal(selectedOrder?.sz ?? 0).mul(selectedOrder?.limitPx ?? 0).toNumber()
    }, [selectedOrder])
    return (
        <>
            <NomasCardHeader
                title={"Limit Order"}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <div className="grid place-items-center">
                    <div className="flex items-center gap-2">
                        <NomasImage src={assetMetadata?.imageUrl} className="w-12 h-12 rounded-full" />
                        <div className="text-lg font-bold">
                            {assetMetadata?.name}
                        </div>
                    </div>
                </div>
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">        
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Time" size="xs"/>
                            <div className="text-xs">
                                {dayjs(selectedOrder?.timestamp ?? 0).format("MMM DD,YYYY [at] HH:mm A")}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Asset" size="xs"/>
                            <div className="text-xs">
                                {selectedOrder?.coin}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <PressableMotion className={twMerge(
                            "flex items-center gap-2 justify-between", 
                            isLong ? "text-bullish" : "text-bearish"
                        )}>
                            <TooltipTitle title="Direction" size="xs"/>
                            <div className="text-xs">
                                {isLong ? "Long" : "Short"}
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={4} />
                        <PressableMotion className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Size" size="xs"/>
                            <div className="text-xs">
                                {selectedOrder?.sz} {selectedOrder?.coin}
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={4} />
                        <PressableMotion className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Value" size="xs"/>
                            <div className="text-xs">
                                ${roundNumber(value, 2)}
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={4} />
                        <PressableMotion className={twMerge(
                            "flex items-center gap-2 justify-between", 
                        )}>
                            <TooltipTitle title="Price" size="xs"/>
                            <div className="text-xs">
                                ${selectedOrder?.limitPx}
                            </div>
                        </PressableMotion>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    onClick={() => {
                        dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                    }}
                >
                    Cancel Order
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}