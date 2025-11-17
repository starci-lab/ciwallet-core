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
} from "@/nomas/components"
import {
    PerpSectionPage,
    selectSelectedAccountByPlatform,
    setPerpSectionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik, useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { SelectAsset } from "./SelectAsset"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const hyperunitGenerateAddressSwrMutation =
    useHyperunitGenerateAddressSwrMutation()
    const hyperunitGenResponse = useAppSelector(
        (state) => state.stateless.sections.perp.hyperunitGenResponse
    )
    const hyperliquidDepositFormik = useHyperliquidDepositFormik()
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
                sourceChain: hyperliquidDepositFormik.values.chainId,
                destinationChain: ChainId.Hyperliquid,
                asset: hyperliquidDepositFormik.values.asset,
                destinationAddress: destinationAccount?.accountAddress || "",
                network,
            }, {
                populateCache: true,
            })
        }
        handleEffect()
    }, [
        hyperliquidDepositFormik.values.asset,
        hyperliquidDepositFormik.values.chainId,
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
                {hyperliquidDepositFormik.values.chainId !== ChainId.Arbitrum && (
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
                                            hyperunitGenResponse[hyperliquidDepositFormik.values.asset]?.address || ""
                                        )}
                                    </div>
                                </NomasSkeleton>
                                <Snippet
                                    copyString={
                                        hyperunitGenResponse[hyperliquidDepositFormik.values.asset]?.address || ""
                                    }
                                />
                            </div>
                        </div>
                    </>
                )}
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    className="w-full"
                    xlSize
                    disabled={!hyperliquidDepositFormik.isValid}
                    isLoading={hyperliquidDepositFormik.isSubmitting}
                    onClick={() => {
                        hyperliquidDepositFormik.submitForm()
                    }}
                >
                    Deposit
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}
