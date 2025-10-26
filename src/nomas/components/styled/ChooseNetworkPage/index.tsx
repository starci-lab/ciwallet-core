import React from "react"
import type { ChainId } from "@ciwallet-sdk/types"
import { NomasCardHeader, NomasCardBody, NomasCard, NomasCardVariant } from "../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"

export interface ChooseNetworkPageProps {
    isSelected: (chainId: ChainId) => boolean
    showBackButton?: boolean
    onBackButtonPress?: () => void
    endContent?: (chainId: ChainId) => React.ReactNode
    isPressable?: boolean
    onPress?: (chainId: ChainId) => void
}

export const ChooseNetworkPage = ({ isSelected, showBackButton, onBackButtonPress, endContent, isPressable, onPress }: ChooseNetworkPageProps) => {  
    return (
        <>
            <NomasCardHeader
                title="Choose Network"
                showBackButton={showBackButton}
                onBackButtonPress={onBackButtonPress}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0 flex flex-col gap-2">
                        {chainManagerObj.toObject().map((chain) => (
                            <ChainCard
                                isPressable={isPressable}
                                onPress={() => onPress?.(chain.id)}
                                key={chain.id}
                                chain={chain}
                                isSelected={isSelected(chain.id)}
                                endContent={(chainId) => endContent?.(chainId)}
                            />
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}