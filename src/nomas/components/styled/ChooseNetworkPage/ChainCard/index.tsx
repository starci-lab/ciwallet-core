import React from "react"
import { NomasImage } from "../../../extends"
import type { ChainMetadata } from "@ciwallet-sdk/types"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import { PressableMotion } from "../../PressableMotion"

export interface ChainCardProps {
  chain: ChainMetadata
  isSelected?: boolean
  onPress?: () => void
  isPressable?: boolean
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain, isSelected = false, onPress, isPressable }) => {
    const platform = chainIdToPlatform(chain.id)    
    const account = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const content = () => {
        return (
            <div
                className={
                    twMerge("p-4 flex items-center gap-2 justify-between radius-button", 
                        isSelected ? "bg-button-dark-nohover border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                }
            >
                <div className="p-0 flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex items-center gap-2">
                            <NomasImage
                                src={chain.iconUrl}
                                alt={chain.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="text-sm text">{chain.name}</div>  
                        </div>
                    </div>
                    {account && <div className="text-xs text-muted">{shortenAddress(account.accountAddress)}</div>}
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