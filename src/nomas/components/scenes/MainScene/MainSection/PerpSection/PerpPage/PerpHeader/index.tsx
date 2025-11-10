import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage, PressableMotion } from "@/nomas/components"
import { hyperliquidObj } from "@/nomas/obj"
import { selectSelectedAssetPrice, useAppSelector } from "@/nomas/redux"
import { CaretRightIcon, CaretUpIcon } from "@phosphor-icons/react"
import { useMemo } from "react"
export const PerpHeader = () => {
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    const selectedAssetPrice = useAppSelector((state) => selectSelectedAssetPrice(state.stateless.sections))
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4">
                <div className="flex items-center justify-between">
                    <PressableMotion className="flex flex-row items-center gap-2">
                        <NomasImage 
                            src={assetMetadata.imageUrl}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="text-sm">
                            {assetMetadata.name}
                        </div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                    <PressableMotion>
                        <div className="flex items-center gap-2">
                            <div className="text">
                                {selectedAssetPrice}
                            </div>
                            <CaretUpIcon className="size-4 text-text-muted" />
                        </div>
                    </PressableMotion>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}