import React, { useEffect } from "react"
import {
    NomasCardBody,
    NomasCardHeader,
    NomasSkeleton,
    Snippet,
    NomasSpacer,
    TooltipTitle,
    NomasCardFooter,
    NomasButton,
    NomasLink,
} from "@/nomas/components"
import {
    DepositFunctionPage,
    HomeSelectorTab,
    HomeTab,
    PerpSectionPage,
    selectSelectedAccountByPlatform,
    setDepositFunctionPage,
    setDepositSelectedChainId,
    setDepositTokenId,
    setHomeSelectorTab,
    setHomeTab,
    setPerpSectionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik, useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { SelectAsset } from "./SelectAsset"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const hyperunitGenerateAddressSwrMutation =
    useHyperunitGenerateAddressSwrMutation()
    const hyperunitGenResponse = useAppSelector(
        (state) => state.stateless.sections.perp.hyperunitGenResponse
    )
    const formik = useHyperliquidDepositFormik()
    // your destination account address
    const destinationAccount = useAppSelector((state) =>
        selectSelectedAccountByPlatform(
            state.persists,
            Platform.Evm
        )
    )
    const network = useAppSelector((state) => state.persists.session.network)
    useEffect(() => {
        const handleEffect = async () => {
            await hyperunitGenerateAddressSwrMutation.trigger({
                sourceChain: formik.values.chainId,
                destinationChain: ChainId.Hyperliquid,
                asset: formik.values.asset,
                destinationAddress: destinationAccount?.accountAddress || "",
                network,
            }, {
                populateCache: true,
            })
        }
        handleEffect()
    }, [
        formik.values.asset,
        formik.values.chainId,
        destinationAccount?.accountAddress,
    ])
    return (
        <>
            <NomasCardHeader
                title="Deposit"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <NomasSpacer y={2} />
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
            </NomasCardBody>
            <NomasCardFooter>
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
                        {formik.values.isEnoughGasBalance ? "Deposit" : "Insufficient Gas Balance"}
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
            </NomasCardFooter>
        </>
    )
}
