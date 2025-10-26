import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasImage, NomasCardVariant } from "../../extends"
import type { ChainId, ChainMetadata } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"
import { ChevronRightIcon } from "lucide-react"
import { PressableMotion } from "../PressableMotion"
import { twMerge } from "tailwind-merge"

export interface SelectChainTabProps {
    isSelected: (chainId: ChainId) => boolean
    onClick: () => void
    variant?: SelectChainTabVariant
}

export enum SelectChainTabVariant {
    Dark = "dark",
    Dark2 = "dark2",
}

export const SelectChainTab = ({ isSelected, onClick, variant = SelectChainTabVariant.Dark }: SelectChainTabProps) => {
    // we define the chain index to show the next chain
    const chains = chainManagerObj.toObject()
    const chainIndex = useMemo(() => {
        return chains.findIndex((chain) => isSelected(chain.id))
    }, [isSelected])
    const endChainIndex = useMemo(() => {
        return Math.min(chainIndex + 6, chains.length)
    }, [chainIndex])
    const startChainIndex = useMemo(() => {
        return Math.max(endChainIndex - 6, 0)
    }, [chainIndex])

    const renderChain = (chain: ChainMetadata, isSelected: boolean) => {
        if (isSelected) {
            return (
                <div key={chain.id} className="px-4 py-1.5 bg-button-nohover radius-button">
                    <NomasCardBody className="p-0">
                        <div className="flex gap-2 items-center">   
                            <NomasImage src={chain.iconUrl} className="w-8 h-8 rounded-full"/>
                            <div className="text-sm text">{chain.name}</div>
                        </div>
                    </NomasCardBody>
                </div>
            )   
        }
        return (
            <NomasImage
                className="w-8 h-8 rounded-full cursor-pointer"
                key={chain.id}
                src={chain.iconUrl} />
        )
    }
    return (
        <PressableMotion onClick={onClick}>
            <div className={twMerge("cursor-pointer radius-card-inner p-2", variant === SelectChainTabVariant.Dark2 ? "bg-card-dark-2" : "bg-card-dark border border-card")}>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center justify-between flex-1">
                        {chains.slice(startChainIndex, chainIndex).map((chain) => {
                            return renderChain(chain, false)
                        })}
                        {renderChain(chains[chainIndex], true)}
                        {chains.slice(chainIndex + 1, endChainIndex).map((chain) => {
                            return renderChain(chain, false)
                        })}
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-muted " />
                </div>
            </div>
        </PressableMotion>
    )
}
