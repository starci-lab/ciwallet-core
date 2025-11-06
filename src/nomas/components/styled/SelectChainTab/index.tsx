import React, { useMemo } from "react"
import { NomasCardBody, NomasImage } from "../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChevronRightIcon } from "lucide-react"
import { PressableMotion } from "../PressableMotion"
import { twMerge } from "tailwind-merge"
import { GlobeIcon } from "@phosphor-icons/react"
import type { ChainIdWithAllNetwork } from "@ciwallet-sdk/types"

export interface SelectChainTabProps {
    isSelected: (chainId: ChainIdWithAllNetwork) => boolean
    onClick: () => void
    variant?: SelectChainTabVariant
    withAllNetworks?: boolean
}

export enum SelectChainTabVariant {
    Dark = "dark",
    Dark2 = "dark2",
}

export interface RenderedChain {
    id: ChainIdWithAllNetwork
    name: string
    icon: React.ReactNode
}

export const SelectChainTab = ({ isSelected, onClick, variant = SelectChainTabVariant.Dark, withAllNetworks = false }: SelectChainTabProps) => {
    // we define the chain index to show the next chain
    const chains = chainManagerObj.toObject()

    const renderedChains = useMemo(() => {
        return chains.map((chain): RenderedChain => {
            return {
                id: chain.id,
                name: chain.name,
                icon: <NomasImage src={chain.iconUrl} className="w-8 h-8 rounded-full cursor-pointer min-w-8 min-h-8" key={chain.id}/>,
            }
        })
    }, [chains])

    const chainIndex = useMemo(() => {
        const foundIndex = renderedChains.findIndex((chain) => isSelected(chain.id))
        return foundIndex !== -1 ? foundIndex : 0
    }, [isSelected, renderedChains])
    const endChainIndex = useMemo(() => {
        return Math.min(chainIndex + (withAllNetworks ? 5 : 6), renderedChains.length)
    }, [chainIndex])
    const startChainIndex = useMemo(() => {
        return Math.max(endChainIndex - (withAllNetworks ? 5 : 6), 0)
    }, [endChainIndex])

    const globeChain = useMemo(() => {
        return {
            id: "all-network",
            name: "All",
            icon: <GlobeIcon className="w-8 h-8 cursor-pointer min-w-8 min-h-8" key="all-network"/>,
        }
    }, [])

    const renderedGlobeChain = (isSelected: boolean) => {
        if (isSelected) {
            return (
                <div key={globeChain.id} className="px-4 py-1.5 bg-button-nohover rounded-button">
                    <NomasCardBody className="p-0">
                        <div className="flex gap-2 items-center">   
                            {globeChain.icon}
                            <div className="text-sm text-text">{globeChain.name}</div>
                        </div>
                    </NomasCardBody>
                </div>
            )
        }
        return <div className="pl-4">{globeChain.icon}</div>
    }

    const renderChain = (chain: RenderedChain, isSelected: boolean) => {
        if (isSelected) {
            return (
                <div key={chain.id} className="px-4 py-1.5 bg-button-nohover rounded-button">
                    <NomasCardBody className="p-0">
                        <div className="flex gap-2 items-center">   
                            {chain.icon}
                            <div className="text-sm text-text">{chain.name}</div>
                        </div>
                    </NomasCardBody>
                </div>
            )   
        }
        return chain.icon
    }
    return (
        <PressableMotion onClick={onClick}>
            <div className={twMerge("cursor-pointer rounded-card-inner p-2", variant === SelectChainTabVariant.Dark2 ? "bg-card-dark-2" : "bg-card-dark border border-card")}>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center justify-between flex-1">
                        {withAllNetworks && renderedGlobeChain(isSelected("all-network"))}
                        {renderedChains.slice(startChainIndex, chainIndex).map((chain) => {
                            return renderChain(chain, isSelected(chain.id))
                        })}
                        {renderChain(renderedChains[chainIndex], isSelected(renderedChains[chainIndex]?.id ?? "all-network"))}
                        {renderedChains.slice(chainIndex + 1, endChainIndex).map((chain) => {
                            return renderChain(chain, isSelected(chain.id ?? "all-network"))
                        })}
                    </div>
                    <ChevronRightIcon className="w-5 h-5text-text-muted " />
                </div>
            </div>
        </PressableMotion>
    )
}
