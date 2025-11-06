import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage, PressableMotion } from "@/nomas/components"
import { hyperliquidObj } from "@/nomas/obj"
import { selectSelectedMarketMarkedPrice, useAppSelector } from "@/nomas/redux"
import { CaretRightIcon, CaretUpIcon } from "@phosphor-icons/react"
export const PerpHeader = () => {
    const selectedMarketId = useAppSelector((state) => state.stateless.sections.perp.selectedMarketId)
    const marketMetadata = hyperliquidObj.getMarketMetadata(selectedMarketId)
    const selectedMarketMarkedPrice = useAppSelector((state) => selectSelectedMarketMarkedPrice(state.stateless.sections))
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4">
                <div className="flex items-center justify-between">
                    <PressableMotion className="flex flex-row items-center gap-2">
                        <NomasImage 
                            src={marketMetadata.imageUrl}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="text-sm">
                            {marketMetadata.name}
                        </div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                    <PressableMotion>
                        <div className="flex items-center gap-2">
                            <div className="text">
                                {selectedMarketMarkedPrice}
                            </div>
                            <CaretUpIcon className="size-4 text-text-muted" />
                        </div>
                    </PressableMotion>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}