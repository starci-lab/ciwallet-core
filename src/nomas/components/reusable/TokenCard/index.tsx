import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage } from "../../extends"
import { ChainId, type Token, type WithClassName } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"
import { PressableMotion } from "../../styled"
import { PinIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

export interface TokenCardProps extends WithClassName {   
    token: Token
    chainId: ChainId
    isPinned?: boolean
    onPin?: () => void
    onUnpin?: () => void
    isPressable?: boolean
}

export const TokenCard = ({ token, chainId, onPin, onUnpin, isPressable = false, isPinned = false, className }: TokenCardProps) => {
    const content = () => {
        return (
            <NomasCard
                variant={NomasCardVariant.Transparent}
                className={twMerge("flex items-center cursor-pointer p-4", className)}
                onClick={isPinned ? onUnpin : onPin}
            >
                <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-0">
                    {/* Left: token info */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                            <NomasImage src={chainManagerObj.getChainById(chainId)?.iconUrl} className="absolute bottom-0 right-0 z-50 w-5 h-5 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm font-medium">{token.name}</div>
                            <div className="text-xs text-text-muted text-left">{token.symbol}</div>
                        </div>
                    </div>
                    {isPinned && (
                        <PinIcon className="text-primary"/>
                    )}
                </NomasCardBody>
            </NomasCard>
        )
    }
    return isPressable ? (
        <PressableMotion onClick={isPinned ? onUnpin : onPin}>
            {content()}
        </PressableMotion>
    ) : (
        content()
    )
}