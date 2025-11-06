import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { hyperliquidObj } from "@/nomas/obj"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage, PressableMotion } from "@/nomas/components"
import { CaretRightIcon } from "@phosphor-icons/react"

export const SelectAsset = () => {
    const dispatch = useAppDispatch()
    const depositCurrentAsset = useAppSelector((state) => state.stateless.sections.perp.depositCurrentAsset)
    const depositAssetInfo = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(depositCurrentAsset), [depositCurrentAsset])

    return (
        <PressableMotion onClick={() => {
            dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
        }}>
            <NomasCard isInner variant={NomasCardVariant.Dark}>
                <NomasCardBody className="p-4 items-center justify-between flex">
                    <div className="flex items-center gap-2">
                        <NomasImage src={depositAssetInfo.iconUrl} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="text-sm text-text">{depositAssetInfo.name}</div>
                            <div className="text-text-muted text-xs text-left">{depositAssetInfo.symbol}</div>
                        </div>
                    </div>
                    <CaretRightIcon className="text-text-muted size-4" />
                </NomasCardBody>
            </NomasCard>
        </PressableMotion>
    )
}