import React, { useMemo } from "react"
import { 
    NomasButton,
    NomasCard, 
    NomasCardBody, 
    NomasCardVariant, 
    NomasInvalidVariant, 
    NomasLink, 
    NomasSpacer, 
    NomasWarningText, 
    TooltipTitle,
} from "@/nomas/components"
import { 
    PerpSectionPage, 
    setOrderSide, 
    setPerpSectionPage, 
    useAppDispatch, 
    useAppSelector 
} from "@/nomas/redux"
import { GearSixIcon } from "@phosphor-icons/react"
import { AssetPositions } from "./AssetPositions"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import { LimitOrders } from "./LimitOrders"

export const PerpTrade = () => {
    const dispatch = useAppDispatch()
    const clearingHouseData = useAppSelector((state) => state.stateless.sections.perp.clearingHouseData)
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetPosition = useMemo(() => {
        return clearingHouseData?.assetPositions.find((assetPosition) => 
            assetPosition.position.coin === hyperliquidObj.getAssetMetadata(selectedAssetId).coin)
    }, [clearingHouseData, selectedAssetId])
    const hasPosition = useMemo(() => {
        return (clearingHouseData?.assetPositions.length ?? 0) > 0
    }, [clearingHouseData])
    const openOrders = useAppSelector((state) => state.stateless.sections.perp.openOrders)
    const hasOrders = useMemo(() => {
        return (openOrders?.length ?? 0) > 0
    }, [openOrders])
    return (
        <div>
            {hasPosition && (
                <>
                    <AssetPositions />
                    <NomasSpacer y={4} />
                </>
            )}
            {hasOrders && (
                <>
                    <LimitOrders /> 
                    <NomasSpacer y={4} />
                </>
            )}
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4">
                    <div className="flex items-center gap-2 justify-between">
                        <TooltipTitle title="Funds" size="sm"/>
                        <div className="text-sm">
                            <div className="flex items-center gap-2">
                                ${clearingHouseData?.marginSummary.accountValue}
                                <NomasLink onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                                }}>
                                    <GearSixIcon className="size-5 text-text-muted" />
                                </NomasLink>
                            </div>
                        </div>
                    </div>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <div className="flex items-center gap-4">
                <NomasButton 
                    noShadow 
                    xlSize 
                    isDisabled={!!assetPosition?.position}
                    className={twMerge(
                        "bg-bullish text-text hover:bg-bullish-hover flex-1", 
                        !!assetPosition?.position && "hover:bg-bullish")}
                    onClick={() => {
                        dispatch(setOrderSide(HyperliquidOrderSide.Buy))
                        dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                    }}> 
                    Long
                </NomasButton>
                <NomasButton 
                    noShadow 
                    xlSize 
                    isDisabled={!!assetPosition?.position}
                    className={twMerge(
                        "bg-bearish text-text hover:bg-bearish-hover flex-1", 
                        !!assetPosition?.position && "hover:bg-bearish"
                    )} 
                    onClick={() => {
                        dispatch(setOrderSide(HyperliquidOrderSide.Sell))
                        dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                    }}>
                    Short
                </NomasButton>
            </div>
            {
                !!assetPosition?.position && (
                    <>
                        <NomasSpacer y={4} />
                        <NomasWarningText
                            color={NomasInvalidVariant.Warning}
                        >
                        You have a position in this asset. You can only trade this asset if you close your position first.
                        </NomasWarningText>
                    </>
                )
            }
        </div>
    )
}