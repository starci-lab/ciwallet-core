import React, { useEffect } from "react"
import { NomasCardBody, NomasCardHeader, NomasSkeleton, Snippet } from "@/nomas/components"
import { PerpSectionPage, selectSelectedAccountByPlatform, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const hyperunitGenerateAddressSwrMutation = useHyperunitGenerateAddressSwrMutation()
    const hyperunitGenResponse = useAppSelector((state) => state.stateless.sections.perp.hyperunitGenResponse)
    const depositCurrentAssetInfo = useAppSelector((state) => state.stateless.sections.perp.depositCurrentAssetInfo)
    const depositSourceChainId = useAppSelector((state) => state.stateless.sections.perp.depositSourceChainId)
    const destinationAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, chainIdToPlatform(depositSourceChainId)))
    const network = useAppSelector((state) => state.persists.session.network)
    useEffect(() => {
        const handleEffect = async () => {
            await hyperunitGenerateAddressSwrMutation.trigger({
                sourceChain: depositSourceChainId,
                destinationChain: ChainId.Hyperliquid,
                asset: depositCurrentAssetInfo,
                destinationAddress: destinationAccount?.accountAddress || "",
                network,
            })
        }
        handleEffect()
    }, [
        depositCurrentAssetInfo, 
        depositSourceChainId, 
        destinationAccount?.accountAddress
    ])
    return (
        <>
            <NomasCardHeader 
                title="Deposit" 
                showBackButton 
                onBackButtonPress={
                    () => {
                        dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                    }} 
            />
            <NomasCardBody>
                <div className="flex items-center gap-2">
                    <NomasSkeleton
                        className="h-5 w-25"
                        isLoading={!hyperunitGenerateAddressSwrMutation.isMutating}
                    >
                        <div>{shortenAddress(hyperunitGenResponse[depositCurrentAssetInfo]?.address || "")}</div>
                    </NomasSkeleton>
                    <Snippet copyString={hyperunitGenResponse[depositCurrentAssetInfo]?.address || ""} />
                </div>
            </NomasCardBody>
        </>
    )
}   