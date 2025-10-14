import React from "react"
import { NomasCard, NomasCardBody, NomasImage, NomasLink } from "../../../extends"
import type { ChainId, ChainMetadata } from "@ciwallet-sdk/types"
import { selectSelectedAccountByChainId, useAppSelector } from "@/nomas/redux"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { CopyIcon, QrCodeIcon } from "@phosphor-icons/react"
import { twMerge } from "tailwind-merge"

export interface ChainCardProps {
  chain: ChainMetadata
  isSelected?: boolean
  onQRCodeClick?: (chainId: ChainId) => void
  onCopyClick?: (chainId: ChainId) => void
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain, isSelected = false, onQRCodeClick, onCopyClick }) => {
    const account = useAppSelector((state) => selectSelectedAccountByChainId(state.persists, chain.id))
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
                <div className="flex items-center gap-2">
                    <NomasLink
                        onPress={() => onQRCodeClick?.(chain.id)}
                    >
                        <QrCodeIcon className="w-8 h-8 text-muted cursor-pointer" />
                    </NomasLink>
                    <NomasLink
                        onPress={() => onCopyClick?.(chain.id)}
                    >
                        <CopyIcon className="w-8 h-8 text-muted cursor-pointer" />
                    </NomasLink>
                </div>
            </div>
        </div>
    )
}