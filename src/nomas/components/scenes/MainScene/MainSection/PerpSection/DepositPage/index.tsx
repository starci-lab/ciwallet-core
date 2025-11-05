import React, { useEffect } from "react"
import { NomasCardBody, NomasCardHeader, Snippet } from "@/nomas/components"
import { PerpSectionPage, selectSelectedAccountByPlatform, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useHyperliquidGenSwrMutation } from "@/nomas/hooks"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const swrMutation = useHyperliquidGenSwrMutation()
    const depositCurrentAssetInfo = useAppSelector((state) => state.stateless.sections.perp.depositCurrentAssetInfo)
    const { asset } = hyperliquidObj.getDepositAssetInfoByAsset(depositCurrentAssetInfo)
    const depositSourceChainId = useAppSelector((state) => state.stateless.sections.perp.depositSourceChainId)
    const destinationAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, chainIdToPlatform(depositSourceChainId)))
    const hyperunitGenResponse = useAppSelector((state) => state.stateless.sections.perp.hyperunitGenResponse)
    useEffect(() => {
        const handleEffect = async () => {
            await swrMutation.trigger({
                sourceChain: depositSourceChainId,
                destinationChain: "hyperliquid",
                asset,
                destinationAddress: destinationAccount?.accountAddress || "",
            })
        }
        handleEffect()
    }, [depositCurrentAssetInfo, depositSourceChainId])
    
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
                <div>
                    <div>{hyperunitGenResponse[depositCurrentAssetInfo]?.address}</div>
                    <Snippet copyString={hyperunitGenResponse[depositCurrentAssetInfo]?.address || ""} />
                </div>
            </NomasCardBody>
        </>
    )
}   