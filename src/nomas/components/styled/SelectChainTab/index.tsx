import React from "react"
import { NomasCard, NomasAvatar, NomasCardBody } from "../../extends"
import type { ChainId } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"

export interface SelectChainTabProps {
    isSelected: (chainId: ChainId) => boolean
    onSelect: (chainId: ChainId) => void
}

export const SelectChainTab = ({ isSelected, onSelect }: SelectChainTabProps) => {
    return (
        <NomasCard className="bg-content3-100">
            <NomasCardBody>
                <div className="flex gap-4 items-center">
                    {chainManagerObj.toObject().map((chain) => {
                        if (isSelected(chain.id)) {
                            return (
                                <NomasCard
                                    key={chain.id}
                                    className="px-2 py-1.5 flex-row flex items-center gap-2 bg-default"
                                >
                                    <NomasAvatar
                                        src={chain.iconUrl}
                                        alt={chain.name}
                                    />
                                    <div>{chain.name}</div>
                                </NomasCard>
                            )
                        }

                        return (
                            <NomasAvatar
                                onClick={() => {
                                    onSelect(chain.id)
                                }}
                                key={chain.id}
                                src={chain.iconUrl}
                                alt={chain.name}
                            />
                        )
                    })}
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}
