import React, { useMemo } from "react"
import { NomasCardHeader, NomasCardBody, NomasCard, NomasCardVariant, PressableMotion, NomasSpacer } from "@/nomas/components"
import { PerpSectionPage, setOrderType, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"

export const SelectOrderTypePage = () => {
    const dispatch = useAppDispatch()
    const orderTypes = useMemo(() => Object.values(hyperliquidObj.getOrderTypeMetadata()), [])
    const selectedOrderType = useAppSelector((state) => state.stateless.sections.perp.orderType)
    return (
        <>
            <NomasCardHeader
                title="Select Order Type"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody scrollable scrollHeight={300} className="p-4">
                        {orderTypes.map((orderType) => (
                            <PressableMotion
                                key={orderType.key}
                                onClick={() => {
                                    dispatch(setOrderType(orderType.key))
                                }}
                            >
                                <div className={
                                    twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                        orderType.key === selectedOrderType ? "py-4 bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                                }
                                key={orderType.key}
                                onClick={async () => {
                                    dispatch(setOrderType(orderType.key))
                                }}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm">{orderType.name}</div>
                                        </div>
                                        <NomasSpacer y={2} />
                                        <div className="text-text-muted text-xs">{orderType.description}</div>
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