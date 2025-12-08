import React from "react"
import { 
    NomasSpacer, 
    TooltipTitle, 
    NomasSkeleton, 
    Snippet, 
    NomasButton, 
    NomasLink, 
} from "@/nomas/components"
import { ChainId } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"
import { tokenManagerObj, chainManagerObj } from "@/nomas/obj"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { 
    HomeTab, 
    HomeSelectorTab, 
    DepositFunctionPage, 
    setHomeTab, 
    setHomeSelectorTab, 
    setDepositSelectedChainId, 
    setDepositTokenId, 
    setDepositFunctionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { SelectAsset } from "./SelectAsset"

export const DepositSection = () => {
    const dispatch = useAppDispatch()
    const formik = useHyperliquidDepositFormik()
    const hyperunitGenerateAddressSwrMutation =
    useHyperunitGenerateAddressSwrMutation()
    const hyperunitGenResponse = useAppSelector(
        (state) => state.stateless.sections.perp.hyperunitGenResponse
    )
    return (
        <>
            <SelectAsset />  
            {formik.values.chainId !== ChainId.Arbitrum && (
                <>
                    <NomasSpacer y={4} />
                    <div className="flex items-center justify-between">
                        <TooltipTitle title="Destination Address" size="sm" className="text"/>
                        <div className="flex items-center gap-2">
                            <NomasSkeleton
                                className="h-5 w-25"
                                isLoading={hyperunitGenerateAddressSwrMutation.isMutating}
                            >
                                <div className="text-sm text-text">
                                    {shortenAddress(
                                        hyperunitGenResponse[formik.values.asset]?.address || ""
                                    )}
                                </div>
                            </NomasSkeleton>
                            <Snippet
                                copyString={
                                    hyperunitGenResponse[formik.values.asset]?.address || ""
                                }
                            />
                        </div>
                    </div>
                </>
            )}
            <NomasSpacer y={6} />
            <div className="w-full">
                <NomasButton
                    className="w-full"
                    xlSize
                    isDisabled={!formik.isValid}
                    isLoading={formik.isSubmitting}
                    onClick={() => {
                        formik.submitForm()
                    }}
                >
                    {
                        (() => {
                            if (formik.values.isEnoughGasBalance) {
                                return "Deposit"
                            }
                            return "Insufficient Gas Balance"
                        })()
                    }
                </NomasButton>
                {
                    !formik.values.isEnoughGasBalance && formik.values.gasTokenId && (() => {
                        const gasToken = tokenManagerObj.getTokenById(formik.values.gasTokenId)
                        if (!gasToken) return
                        const chainMetadata = chainManagerObj.getChainById(gasToken.chainId)
                        return (
                            <>
                                <NomasSpacer y={4}/>
                                <div className="flex items-center gap-1">
                                    <div className="text-muted text-xs">You need to have at least {chainMetadata?.minimumGasRequired} {gasToken.symbol} to cover the gas fee.</div>
                                    <NomasLink 
                                        onPress={() => {
                                            dispatch(setHomeTab(HomeTab.Home))
                                            dispatch(setHomeSelectorTab(HomeSelectorTab.Deposit))
                                            dispatch(setDepositSelectedChainId(gasToken?.chainId ?? ChainId.Monad))
                                            dispatch(setDepositTokenId(formik.values.gasTokenId))
                                            dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                                        }}
                                        className="text-xs text-primary"
                                    >
                                    Deposit
                                    </NomasLink>
                                </div>    
                            </>
                        )
                    })()}
            </div>
        </>
    )
}