import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer, TooltipTitle } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"
import { LimitOrder } from "./LimitOrder"

export const LimitOrders = () => {
    const openOrders = useAppSelector((state) => state.stateless.sections.perp.openOrders)
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <TooltipTitle title="Orders" size="sm" className="p-4 pb-0"/>
            <NomasCardBody className="p-4" scrollable={
                (openOrders?.length ?? 0) > 3
            } scrollHeight={180}> 
                <div className="flex flex-col gap-4">
                    {
                        openOrders?.map((openOrder) => (
                            <LimitOrder limitOrder={openOrder} key={openOrder.oid} />
                        ))
                    }
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}