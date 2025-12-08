import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"
import type { ChainId } from "@ciwallet-sdk/types"
import { SettingsPage, setSettingsPage, setRPCChainId, useAppDispatch } from "@/nomas/redux"

interface RenderedChain {
    id: ChainId
    name: string
    component: React.ReactNode
}

export const RPCScene = () => {
    const renderedChains = useMemo(() => {
        const chains: Array<RenderedChain> = chainManagerObj.toObject().map((chain) => {
            return {
                id: chain.id,
                name: chain.name,
                component: <ChainCard
                    isPressable={true}
                    onPress={() => {
                        dispatch(setRPCChainId(chain.id))
                        dispatch(setSettingsPage(SettingsPage.RPCDetails))
                    }}
                    key={chain.id}
                    chain={chain}
                    isSelected={false}
                />,
            }
        })
        return chains
    }, [])
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="w-full">
            <NomasCardHeader title="Select chain" showBackButton onBackButtonPress={() => {
                dispatch(setSettingsPage(SettingsPage.Main))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0 flex flex-col gap-4" scrollable scrollHeight={300}>
                        {renderedChains.map((chain) => chain.component)}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}