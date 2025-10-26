import React from "react"
import type { ChainManager } from "@ciwallet-sdk/classes"
import { NomasCard, NomasCardBody, NomasImage } from "../../extends"
import type { ChainId } from "@ciwallet-sdk/types"

export interface ChooseNetworkProps {
    chainManager: ChainManager
    isSelected: (chainId: ChainId) => boolean
    onSelect: (chainId: ChainId) => void
}

export const ChooseNetwork = ({ chainManager, isSelected, onSelect }: ChooseNetworkProps) => {
    return (
        <NomasCard className="bg-content3">
            <NomasCardBody>
                <div className="flex gap-4 items-center">
                    {chainManager.toObject().map((chain) => {
                        if (isSelected(chain.id)) {
                            return (
                                <NomasCard
                                    key={chain.id}
                                    className="px-2 py-1.5 flex-row flex items-center gap-2 bg-default"
                                >
                                    <NomasImage
                                        src={chain.iconUrl}
                                        alt={chain.name}
                                    />
                                    <div>{chain.name}</div>
                                </NomasCard>
                            )
                        }

                        return (
                            <NomasImage
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
