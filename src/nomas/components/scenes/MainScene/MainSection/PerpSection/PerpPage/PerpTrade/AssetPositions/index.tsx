import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer, TooltipTitle } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"
import { AssetPosition } from "./AssetPosition"

export const AssetPositions = () => {
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4" scrollable={
                (clearingHouseData?.assetPositions.length ?? 0) > 3
            } scrollHeight={180}> 
                <TooltipTitle title="Positions" size="sm" />
                <NomasSpacer y={4} />
                <div className="flex flex-col gap-4">
                    {
                        clearingHouseData?.assetPositions.map((assetPosition) => (
                            <AssetPosition assetPosition={assetPosition} key={assetPosition.position.coin} />
                        ))
                    }
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}