import React, { useMemo } from "react"
import { type ChainIdWithAllNetwork } from "@ciwallet-sdk/types"
import { NomasCardHeader, NomasCardBody, NomasCard, NomasCardVariant } from "../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"
import { GlobeIcon } from "@phosphor-icons/react"
import { twMerge } from "tailwind-merge"
import { PressableMotion } from "../PressableMotion"

export interface ChooseNetworkPageProps {
    withAllNetworks?: boolean
    isSelected: (chainId: ChainIdWithAllNetwork) => boolean
    showBackButton?: boolean
    onBackButtonPress?: () => void
    endContent?: (chainId: ChainIdWithAllNetwork) => React.ReactNode
    isPressable?: boolean
    onPress?: (chainId: ChainIdWithAllNetwork) => void
}

interface RenderedChain {
    id: ChainIdWithAllNetwork
    name: string
    component: React.ReactNode
}

export const ChooseNetworkPage = ({ withAllNetworks = false, isSelected, showBackButton, onBackButtonPress, endContent, isPressable, onPress }: ChooseNetworkPageProps) => {  
    const renderedChains = useMemo(() => {
        const chains: Array<RenderedChain> = chainManagerObj.toObject().map((chain) => {
            return {
                id: chain.id,
                name: chain.name,
                component: <ChainCard
                    isPressable={isPressable}
                    onPress={() => onPress?.(chain.id)}
                    key={chain.id}
                    chain={chain}
                    isSelected={isSelected(chain.id)}
                />,
            }
        })
        if (withAllNetworks) {
            chains.unshift({
                id: "all-network",
                name: "All",
                component: <div
                    className={
                        twMerge("px-3 py-2 flex items-center gap-2 justify-between radius-button", 
                            isSelected("all-network") ? "bg-button-dark-nohover border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                    }
                >
                    <PressableMotion onClick={() => {
                        onPress?.("all-network")
                    }} className="w-full">
                        <div className="p-0 flex items-center justify-between w-full">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <GlobeIcon className="w-10 h-10"/>
                                    <div className="text-sm text">All Networks</div>  
                                </div>
                            </div>    
                            <div className="text-xs text-muted">{chainManagerObj.toObject().length} chains</div>
                        </div>
                    </PressableMotion>
                </div>,
            })
        }
        return chains
    }, [withAllNetworks, isSelected, isPressable, onPress, endContent])
    return (
        <>
            <NomasCardHeader
                title="Choose Network"
                showBackButton={showBackButton}
                onBackButtonPress={onBackButtonPress}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4" >
                    <NomasCardBody scrollable className="p-0 flex flex-col gap-2">
                        {renderedChains.map((chain) => chain.component)}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}