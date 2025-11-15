import { NomasCardBody, NomasCardHeader, NomasInput, NomasLink, NomasSlider, NomasSpacer } from "@/nomas/components"
import { hyperliquidObj } from "@/nomas/obj"
import { PerpSectionPage, selectPerpUniverseById, setLeverage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import React, { useEffect, useMemo } from "react"
import Decimal from "decimal.js"
import { useHyperliquidUpdateLeverageSwrMutation } from "@/nomas/hooks"

export const LeveragePage = () => {
    const dispatch = useAppDispatch()
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const activeAssetData = useAppSelector((state) => state.stateless.sections.perp.activeAssetData)
    const perpMeta = useAppSelector((state) => selectPerpUniverseById(state.stateless.sections))
    const hyperliquidUpdateLeverageSwrMutation = useHyperliquidUpdateLeverageSwrMutation()

    useEffect(() => {
        const timeout = setTimeout(() => {
            hyperliquidUpdateLeverageSwrMutation?.trigger({
                asset: selectedAssetId,
                leverage,
                isCross: activeAssetData?.leverage.type === "cross",
            })
        }, 1000)
        return () => clearTimeout(timeout)
    }, [leverage, dispatch])
    return (
        <>
            <NomasCardHeader
                title={`${assetMetadata.name} Leverage`}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody> 
                <NomasInput
                    value={leverage.toString()}
                    textAlign="center"
                    onValueChange={(value) => {
                        const _value = new Decimal(value)
                        if (_value.gt(perpMeta?.maxLeverage ?? 0)) return
                        dispatch(setLeverage(_value.toNumber()))
                    }}
                    numericOnly
                    min={1}
                    max={perpMeta?.maxLeverage ?? 0}
                    prefixIcon={
                        <NomasLink
                            onClick={() => {
                                if (leverage <= 1) return
                                dispatch(setLeverage(leverage - 1))
                            }}
                        >
                            <MinusIcon className="size-4 text-text-muted" />
                        </NomasLink>
                    }
                    postfixIcon={
                        <NomasLink
                            onClick={() => {
                                if (leverage >= (perpMeta?.maxLeverage ?? 0)) return
                                dispatch(setLeverage(leverage + 1))
                            }}
                        >
                            <PlusIcon className="size-4 text-text-muted" />
                        </NomasLink>
                    }
                    className="w-full"
                />
                <NomasSpacer y={6} />
                <NomasSlider
                    onValueChange={
                        (value) => {
                            if (Array.isArray(value)) {
                                dispatch(setLeverage(value[0]))
                                return
                            }
                            dispatch(setLeverage(new Decimal(value).toNumber()))
                        }}
                    defaultValue={[1]}
                    value={[leverage]}
                    min={1}
                    max={perpMeta?.maxLeverage}
                    className="w-full"
                />
                <NomasSpacer y={2} />
                <div className="flex items-center gap-2 w-full justify-between">
                    <div className="text-sm">
                        1x
                    </div>
                    <div className="text-sm">
                        {perpMeta?.maxLeverage}x
                    </div>
                </div>
                <NomasSpacer y={4} />
                <div className="text-xs text-text-muted ">
                    Note that setting a higher leverage increases the risk of liquidation.
                </div>
            </NomasCardBody>
        </>
    )
}