import { hyperliquidObj } from "@/nomas/obj"
import type { ClearingHouseData } from "@ciwallet-sdk/classes"
import React, { useMemo } from "react"
import { NomasImage, PressableMotion } from "@/nomas/components"
import { twMerge } from "tailwind-merge"
import Decimal from "decimal.js"
import { computePercentage, roundNumber } from "@ciwallet-sdk/utils"
import { PerpSectionPage, setPerpSectionPage, setPositionAssetId } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"

interface AssetPositionProps {
    assetPosition: ClearingHouseData["assetPositions"][number]
}
export const AssetPosition = ({ assetPosition }: AssetPositionProps) => {
    const dispatch = useAppDispatch()
    const metadata = useMemo(() => {
        return hyperliquidObj.getAssetMetadataByCoin(assetPosition.position.coin)
    }, [assetPosition])
    const isLong = useMemo(() => {
        return new Decimal(assetPosition.position.szi).gt(0)
    }, [assetPosition])
    const [unrealizedRoiPercentage] = useMemo(() => {
        const unrealizedRoiPercentage = new Decimal(computePercentage(assetPosition.position.unrealizedPnl, assetPosition.position.marginUsed))
        const isPositive = unrealizedRoiPercentage.gt(0)
        return [`${isPositive ? "+" : "-"}${roundNumber(unrealizedRoiPercentage.abs().toNumber(), 2)}%`, isPositive]
    }, [assetPosition])
    const [unrealizedPnl, isUnrealizedPnlPositive] = useMemo(() => {
        const decimalValue = new Decimal(assetPosition.position.unrealizedPnl)
        const unrealizedPnl = decimalValue.abs()
        const isPositive = unrealizedPnl.gt(0)
        return [`${isPositive ? "+" : "-"}$${roundNumber(unrealizedPnl.abs().toNumber(), 2)}`, isPositive]
    }, [assetPosition])
    
    return (
        <PressableMotion onClick={() => {
            dispatch(setPositionAssetId(hyperliquidObj.getAssetIdByCoin(assetPosition.position.coin)))
            dispatch(setPerpSectionPage(PerpSectionPage.Position))
        }} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <NomasImage src={metadata.imageUrl} className="w-10 h-10 rounded-full" />
                <div>
                    <div className="text-sm">
                        {metadata.name}
                    </div>
                    <div className={twMerge("text-xs text-text-muted")}>
                        {`${isLong ? "Long" : "Short"} ${assetPosition.position.leverage.value}x`}
                    </div>
                </div>
            </div>
            <div>
                <div className="text-sm text-end">
                    ${
                        roundNumber(
                            new Decimal(assetPosition.position.positionValue)
                                .div(new Decimal(assetPosition.position.leverage.value)).toNumber(),
                        )
                    }
                </div>
                <div className={twMerge("text-xs text-end", isUnrealizedPnlPositive ? "text-bullish" : "text-bearish")}>
                    {unrealizedPnl} ({unrealizedRoiPercentage})
                </div>
            </div>
        </PressableMotion>
    )
}