import React, { useEffect } from "react"
import {
    NomasCardBody,
    NomasCardHeader,
    NomasSkeleton,
    Snippet,
    NomasSpacer,
    TooltipTitle,
} from "@/nomas/components"
import {
    PerpSectionPage,
    selectSelectedAccountByPlatform,
    setPerpSectionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"
import { SelectAsset } from "./SelectAsset"
import { SourceChain } from "./SourceChain"

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
    const destinationAccount = useAppSelector((state) =>
        selectSelectedAccountByPlatform(
            state.persists,
            chainIdToPlatform(depositSourceChainId)
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
                <TooltipTitle title="Select Asset" size="sm" className="text"/>
                <NomasSpacer y={2} />
                <SelectAsset />
                <NomasSpacer y={4} />
                <TooltipTitle title="Source Chain" size="sm" className="text"/>
                <NomasSpacer y={2} />
                <SourceChain />
                {depositSourceChainId !== ChainId.Arbitrum && (
                    <div className="flex items-center gap-2">
                        <NomasSkeleton
                            className="h-5 w-25"
                            isLoading={hyperunitGenerateAddressSwrMutation.isMutating}
                        >
                            <div>
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
                )}
            </NomasCardBody>
        </>
    )
}
