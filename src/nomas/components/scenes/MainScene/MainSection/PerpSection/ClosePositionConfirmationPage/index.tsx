import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasSpacer, TooltipTitle } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { hyperliquidObj } from "@/nomas/obj"
import Decimal from "decimal.js"
import { roundNumber } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import { useHyperliquidClosePositionSwrMutation } from "@/nomas/hooks/singleton/hyperliquid"
export const ClosePositionConfirmationPage = () => {
    const dispatch = useAppDispatch()
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const positionAssetId = useAppSelector((state) => state.stateless.sections.perp.positionAssetId)
    const assetPosition = useMemo(() => {
        return clearingHouseData?.assetPositions.find((assetPosition) => assetPosition.position.coin === hyperliquidObj.getAssetMetadata(positionAssetId).coin)
    }, [clearingHouseData, positionAssetId])
    const isLong = useMemo(() => {
        return assetPosition?.position.szi && new Decimal(assetPosition?.position.szi).gt(0)
    }, [assetPosition])
    const [pnl, isPnlPositive] = useMemo(() => {
        const decimalValue = new Decimal(assetPosition?.position.unrealizedPnl ?? 0)
        const isPositive = decimalValue.gt(0)
        const sign = decimalValue.gt(0) ? "+" : "-"
        const pnl = decimalValue.abs()
        if (pnl.lt(0.01)) {
            return [`${sign}<$0.01`, isPositive]
        } else {
            return [`${sign}$${roundNumber(pnl.abs().toNumber(), 2)}`, isPositive]
        }
    }, [assetPosition])
    const closePositionSwrMutation = useHyperliquidClosePositionSwrMutation()
    const positionAssetCtx = useAppSelector((state) => state.stateless.sections.perp.positionAssetCtx)
    const markPx = useMemo(() => {
        return positionAssetCtx?.ctx.markPx ?? 0
    }, [positionAssetCtx])
    return (
        <>
            <NomasCardHeader
                title={`Close ${isLong ? "Long" : "Short"}`}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Position))
                }}
            />
            <NomasCardBody> 
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="Position Value" size="xs"/>
                            <div className="text-xs">
                                ${roundNumber(new Decimal(assetPosition?.position.positionValue ?? 0).toNumber(), 2)}
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <div className="flex items-center gap-2 justify-between">
                            <TooltipTitle title="PNL" size="xs"/>
                            <div className={twMerge("text-xs", isPnlPositive ? "text-bullish" : "text-bearish")}>
                                {pnl}
                            </div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    isLoading={closePositionSwrMutation?.isMutating}
                    onClick={async () => {
                        await closePositionSwrMutation?.trigger({
                            price: markPx.toString(),
                            size: assetPosition?.position.szi ?? "0",
                            assetId: positionAssetId,
                        })
                        dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                    }}>
                    Close {isLong ? "Long" : "Short"}
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}