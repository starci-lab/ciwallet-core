import React, { useMemo } from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
    NomasSpacer,
    PressableMotion,
} from "@/nomas/components"
import {
    PerpSectionPage,
    setPerpSectionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"
import { HyperliquidMarketMode, type HyperliquidMarketModeMetadata } from "@ciwallet-sdk/classes"
import { CubeIcon, ShuffleIcon } from "@phosphor-icons/react"
import { useHyperliquidUpdateLeverageSwrMutation } from "@/nomas/hooks"

export const MarginModePage = () => {
    const dispatch = useAppDispatch()
    const modes = useMemo(() => Object.values(hyperliquidObj.getModeMetadata()), [])
    const hyperliquidUpdateLeverageSwrMutation = useHyperliquidUpdateLeverageSwrMutation()
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    
    
    const renderIcon = (mode: HyperliquidMarketModeMetadata) => {
        switch (mode.key) {
        case HyperliquidMarketMode.Isolated:
            return <CubeIcon className="size-4" />
        case HyperliquidMarketMode.CrossMargin:
            return <ShuffleIcon className="size-4" />
        default:
            return null
        }
    }
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    return (
        <>
            <NomasCardHeader
                title={`${assetMetadata.name} Margin Mode`}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                }}
                description={
                    ""
                }
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        {modes.map((mode) => (
                            <PressableMotion
                                key={mode.key}
                                onClick={() => {
                                    hyperliquidUpdateLeverageSwrMutation?.trigger({
                                        asset: selectedAssetId,
                                        leverage,
                                        isCross: mode.key === HyperliquidMarketMode.CrossMargin,
                                    })
                                    dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                                }}
                            >
                                <div className={
                                    twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                        mode.key === (isCross ? HyperliquidMarketMode.CrossMargin : HyperliquidMarketMode.Isolated) ? "py-4 bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                                }
                                key={mode.key}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {renderIcon(mode)}
                                            <div className="text-sm">{mode.name}</div>
                                        </div>
                                        <NomasSpacer y={2} />
                                        <div className="text-text-muted text-xs">{mode.description}</div>
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