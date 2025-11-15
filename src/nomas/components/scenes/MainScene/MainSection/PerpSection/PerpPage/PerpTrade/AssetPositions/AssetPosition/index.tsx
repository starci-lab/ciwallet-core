import { hyperliquidObj } from "@/nomas/obj"
import type { ClearingHouseData } from "@ciwallet-sdk/classes"
import React, { useMemo } from "react"
import { NomasImage, PressableMotion } from "@/nomas/components"
import { twMerge } from "tailwind-merge"
import Decimal from "decimal.js"
import { computePercentage } from "@ciwallet-sdk/utils"

interface AssetPositionProps {
    assetPosition: ClearingHouseData["assetPositions"][number]
}
export const AssetPosition = ({ assetPosition }: AssetPositionProps) => {
    const metadata = useMemo(() => {
        return hyperliquidObj.getAssetMetadataByCoin(assetPosition.position.coin)
    }, [assetPosition])
    const isPositiveUnrealizedPnl = useMemo(() => {
        return new Decimal(assetPosition.position.unrealizedPnl).gt(0)
    }, [assetPosition])
    const isLong = useMemo(() => {
        return new Decimal(assetPosition.position.szi).gt(0)
    }, [assetPosition])
    const unrealizedRoiPercentage = useMemo(() => {
        return new Decimal(computePercentage(assetPosition.position.unrealizedPnl, assetPosition.position.marginUsed))
    }, [assetPosition])
    const sign = useMemo(() => {
        return isPositiveUnrealizedPnl ? "+" : "-"
    }, [isPositiveUnrealizedPnl])
    const unrealizedPnl = useMemo(() => {
        return new Decimal(assetPosition.position.unrealizedPnl).abs().toNumber()
    }, [assetPosition])
    
    return (
        <PressableMotion onClick={() => {}} className="flex items-center justify-between">
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
                    ${assetPosition.position.positionValue}
                </div>
                <div className={twMerge("text-xs text-end", isPositiveUnrealizedPnl ? "text-bullish" : "text-bearish")}>
                    {`${sign}$${unrealizedPnl} (${sign}${unrealizedRoiPercentage.toFixed(2)}%)`}
                </div>
            </div>
        </PressableMotion>
    )
}