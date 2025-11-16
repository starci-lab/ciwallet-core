import React from "react"
import { 
    NomasCard, 
    NomasCardBody, 
    NomasCardHeader, 
    NomasCardVariant, 
    NomasImage, 
    PressableMotion
} from "@/nomas/components"
import { 
    PerpSectionPage, 
    selectPerpUniverses, 
    setPerpSectionPage, 
    setSelectedAssetId, 
    useAppDispatch, 
    useAppSelector
} from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { twMerge } from "tailwind-merge"

export const SelectAssetPage = () => {
    const dispatch = useAppDispatch()
    const perpMetas = useAppSelector((state) => selectPerpUniverses(state.stateless.sections))
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    return (
        <>
            <NomasCardHeader
                title={"Select Asset"}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        {
                            perpMetas.map((perpMeta) => {   
                                try {
                                    const selectedAssetMetadata = hyperliquidObj.getAssetMetadataByCoin(perpMeta.name)
                                    if (!selectedAssetMetadata) return null
                                    return (
                                        <PressableMotion
                                            key={perpMeta.name}
                                            className={
                                                twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                                    hyperliquidObj.getAssetIdByCoin(perpMeta.name) === selectedAssetId 
                                                        ? "py-4 bg-button-dark border-border-card shadow-button" 
                                                        : "bg-card-foreground transition-colors !shadow-none"
                                                )                                          
                                            }
                                            onClick={
                                                () => {
                                                    const assetId = hyperliquidObj.getAssetIdByCoin(perpMeta.name)
                                                    if (!assetId) return
                                                    dispatch(setSelectedAssetId(assetId))
                                                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                                                }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <NomasImage src={selectedAssetMetadata.imageUrl} className="w-10 h-10 rounded-full" />
                                                <div className="text-sm">{selectedAssetMetadata.name}</div>
                                            </div>
                                        </PressableMotion>
                                    )
                                } catch{
                                    return null
                                }
                            })
                        }
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}