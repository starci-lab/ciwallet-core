import React from "react"
import { NomasCard, NomasCardBody, NomasImage, NomasCardVariant } from "../../extends"
import type { ChainId } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"

export interface SelectChainTabProps {
    isSelected: (chainId: ChainId) => boolean
    onSelect: (chainId: ChainId) => void
}

export const SelectChainTab = ({ isSelected, onSelect }: SelectChainTabProps) => {
    return (
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-0">
                <div className="flex gap-4 items-center">
                    {chainManagerObj.toObject().map((chain) => {
                        if (isSelected(chain.id)) {
                            return (
                                <div 
                                    key={chain.id}
                                    className="px-2 py-1.5 bg-button radius-button"
                                >
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
                                onClick={() => {
                                    onSelect(chain.id)
                                }}
                                className="w-8 h-8 rounded-full cursor-pointer"
                                key={chain.id}
                                src={chain.iconUrl} />
                        )
                    })}
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}
