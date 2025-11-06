import React, { useMemo } from "react"
import { NomasImage } from "../../../../extends"
import type { ChainMetadata } from "@ciwallet-sdk/types"
import { useAppSelector } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"
import { PressableMotion } from "../../../../styled"
import { CaretRightIcon } from "@phosphor-icons/react"
import pluralize from "pluralize"

export interface ChainCardProps {
  chain: ChainMetadata
  isSelected?: boolean
  onPress?: () => void
  isPressable?: boolean
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain, isSelected = false, onPress, isPressable }) => {
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const renderRpcs: Array<string> = useMemo(() => {
        return rpcs[chain.id]?.[network] || []
    }, [rpcs, chain.id, network])
    const content = () => {
        return (
            <div
                className={
                    twMerge("p-4 flex items-center gap-2 justify-between rounded-button", 
                        isSelected ? "bg-button-dark-nohover border-border-cardshadow-button" : "bg-card-foreground transition-colors !shadow-none")
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
                            <div className="text-sm text-text">{chain.name}</div>  
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm">
                            {`${renderRpcs.length} ${pluralize("endpoint", renderRpcs.length)}`}
                        </div>
                        <CaretRightIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>
        )
    }
    return (
        isPressable ? (
            <PressableMotion onClick={onPress}>{content()}</PressableMotion>
        ) : (
            content()
        )
    )
}