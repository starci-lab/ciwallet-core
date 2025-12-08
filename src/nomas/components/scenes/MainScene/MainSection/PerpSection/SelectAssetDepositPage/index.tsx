import React, { useMemo } from "react"
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
    setPerpSectionPage, 
    useAppDispatch,
} from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"
import { CheckCircleIcon } from "@phosphor-icons/react"

export const SelectAssetDepositPage = () => {
    const dispatch = useAppDispatch()
    const formik = useHyperliquidDepositFormik()
    const hyperliquidDepositAssets = useMemo(() => hyperliquidObj.getDepositAssetInfos(), [])
    return (
        <>
            <NomasCardHeader
                title={"Select Asset"}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4" scrollable scrollHeight={300}>
                        {
                            hyperliquidDepositAssets.map(
                                (hyperliquidDepositAsset) => {   
                                    try {
                                        return (
                                            <PressableMotion
                                                key={hyperliquidDepositAsset.asset}
                                                className="p-4 flex items-center gap-2 justify-between rounded-button w-full"
                                                onClick={
                                                    () => {
                                                        formik.setFieldValue("asset", hyperliquidDepositAsset.asset)
                                                        dispatch(setPerpSectionPage(PerpSectionPage.SourceChain))
                                                    }}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <NomasImage src={hyperliquidDepositAsset.iconUrl} className="w-10 h-10 rounded-full" />
                                                        <div className="text-sm">{hyperliquidDepositAsset.name}</div>
                                                    </div>
                                                    {
                                                        formik.values.asset === hyperliquidDepositAsset.asset ? (
                                                            <CheckCircleIcon className="w-5 h-5" weight="fill"/>
                                                        ) : null
                                                    }
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