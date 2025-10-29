import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage } from "../../extends"
import { type UnifiedToken } from "@ciwallet-sdk/types"
import { PressableMotion } from "../../styled"
import { PinIcon } from "lucide-react"

export interface UnifiedTokenCardProps {   
    token: UnifiedToken
    onPin?: () => void
    onUnpin?: () => void
    isPressable?: boolean
    isPinned?: boolean
}

export const UnifiedTokenCard = ({ token, onPin, onUnpin, isPressable = false, isPinned = false }: UnifiedTokenCardProps) => {
 
    const content = () => {
        return (
            <NomasCard
                className="flex items-center cursor-pointer"
                onClick={isPinned ? onUnpin : onPin}
                variant={NomasCardVariant.Transparent}
            >
                <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-4">
                    {/* Left: token info */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm font-medium">{token.name}</div>
                            <div className="text-xs text-muted text-left">{token.symbol}</div>
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