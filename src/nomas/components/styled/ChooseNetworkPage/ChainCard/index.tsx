import React from "react"
import { NomasImage } from "../../../extends"
import type { ChainId, ChainMetadata } from "@ciwallet-sdk/types"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import { PressableMotion } from "../../PressableMotion"

export interface ChainCardProps {
  chain: ChainMetadata
  isSelected?: boolean
  onPress?: () => void
  isPressable?: boolean
  endContent?: (chainId: ChainId) => React.ReactNode
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain, isSelected = false, onPress, isPressable, endContent }) => {
    const platform = chainIdToPlatform(chain.id)    
    const account = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const content = () => {
        return (
            <div
                className={
                    twMerge("px-3 py-2 flex items-center gap-2 justify-between radius-button", 
                        isSelected ? "bg-button-dark-nohover border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                }
            >
                <div className="p-0 flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex items-center gap-2">
                            <NomasImage
                                src={chain.iconUrl}
                                alt={chain.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="text-sm text">{chain.name}</div>  
                        </div>
                        {account && <div className="text-sm text-muted">{shortenAddress(account.accountAddress)}</div>}
                    </div>
                    {endContent?.(chain.id)}
                </div>
            </div>
        )
    }
    return (
        isPressable ? (
            <PressableMotion onClick={() => onPress?.()}>{content()}</PressableMotion>
        ) : (
            content()
        )
    )
}