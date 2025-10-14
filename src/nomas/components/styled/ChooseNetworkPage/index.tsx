import React from "react"
import type { ChainId } from "@ciwallet-sdk/types"
import { NomasCardHeader, NomasCardBody, NomasCard, NomasCardVariant } from "../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"

export interface ChooseNetworkPageProps {
    isSelected: (chainId: ChainId) => boolean
    showBackButton?: boolean
    onBackButtonPress?: () => void
    onQRCodeClick?: (chainId: ChainId) => void
    onCopyClick?: (chainId: ChainId) => void
}

export const ChooseNetworkPage = ({ isSelected, showBackButton, onBackButtonPress, onQRCodeClick, onCopyClick }: ChooseNetworkPageProps) => {  
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
                                key={chain.id}
                                chain={chain}
                                isSelected={isSelected(chain.id)}
                                onQRCodeClick={(chainId) => onQRCodeClick?.(chainId)}
                                onCopyClick={(chainId) => onCopyClick?.(chainId)}
                            />
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}