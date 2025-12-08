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
import { CheckCircleIcon } from "@phosphor-icons/react"

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
                    <NomasCardBody className="p-4 gap-4 flex flex-col" scrollable scrollHeight={300}>
                        {
                            perpMetas.map((perpMeta) => {   
                                try {
                                    const selectedAssetMetadata = hyperliquidObj.getAssetMetadataByCoin(perpMeta.name)
                                    if (!selectedAssetMetadata) return null
                                    return (
                                        <PressableMotion
                                            key={perpMeta.name}
                                            className="py-1 flex items-center gap-2 justify-between rounded-button w-full"
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
                                            {
                                                selectedAssetId === hyperliquidObj.getAssetIdByCoin(perpMeta.name) ? (
                                                    <CheckCircleIcon className="w-5 h-5" weight="fill"/>
                                                ) : null
                                            }
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