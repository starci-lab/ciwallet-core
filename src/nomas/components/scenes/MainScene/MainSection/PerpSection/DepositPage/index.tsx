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
import { useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { SelectAsset } from "./SelectAsset"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const hyperunitGenerateAddressSwrMutation =
    useHyperunitGenerateAddressSwrMutation()
    const hyperunitGenResponse = useAppSelector(
        (state) => state.stateless.sections.perp.hyperunitGenResponse
    )
    const depositCurrentAsset = useAppSelector(
        (state) => state.stateless.sections.perp.depositCurrentAsset
    )
    const depositSourceChainId = useAppSelector(
        (state) => state.stateless.sections.perp.depositSourceChainId
    )
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
                sourceChain: depositSourceChainId,
                destinationChain: ChainId.Hyperliquid,
                asset: depositCurrentAsset,
                destinationAddress: destinationAccount?.accountAddress || "",
                network,
            }, {
                populateCache: true,
            })
        }
        handleEffect()
    }, [
        depositCurrentAsset,
        depositSourceChainId,
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
                {depositSourceChainId !== ChainId.Arbitrum && (
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
                                            hyperunitGenResponse[depositCurrentAsset]?.address || ""
                                        )}
                                    </div>
                                </NomasSkeleton>
                                <Snippet
                                    copyString={
                                        hyperunitGenResponse[depositCurrentAsset]?.address || ""
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
                    onClick={() => {
                        dispatch(setPerpSectionPage(PerpSectionPage.Deposit))
                    }}
                >
                    Deposit
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}
