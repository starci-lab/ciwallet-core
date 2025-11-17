import React, { useMemo } from "react"
import type { OpenOrders } from "@ciwallet-sdk/classes"
import type { ElementOf } from "@ciwallet-sdk/types"
import { CaretRightIcon } from "@phosphor-icons/react"
import { PressableMotion } from "@/nomas/components/styled"
import { PerpSectionPage, setPerpSectionPage, setSelectedOrder, useAppDispatch } from "@/nomas/redux"

export interface LimitOrderProps {
    limitOrder: ElementOf<OpenOrders>
}

export const LimitOrder = ({ limitOrder }: LimitOrderProps) => {
    const dispatch = useAppDispatch()
    const isLong = useMemo(() => {
        return limitOrder.side === "B"
    }, [limitOrder])
    if (limitOrder.orderType !== "Limit") return null
    return (
        <PressableMotion className="flex justify-between items-center" onClick={() => {
            dispatch(setSelectedOrder(limitOrder))
            dispatch(setPerpSectionPage(PerpSectionPage.Order))
        }}>
            <div>
                <div className="text-xs text-text-muted">
                Limit
                </div>
                <div className="text-sm">
                    {isLong ? "Long" : "Short"} {limitOrder.sz} {limitOrder.coin} at ${limitOrder.limitPx}
                </div>
            </div>
            <CaretRightIcon className="size-4 text-text-muted" />
        </PressableMotion>
    )
}