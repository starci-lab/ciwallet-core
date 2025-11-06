import React from "react"
import { NomasSpacer } from "../../../../extends"
import { MyWalletsPage, selectSelectedAccountByPlatform, setMyWalletsPage, setSelectedPlatform, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"
import { PressableMotion, TokenIcons } from "../../../../styled"
import { CaretRightIcon } from "@phosphor-icons/react"
import type { PlatformMetadata } from "@ciwallet-sdk/types"
import { shortenAddress } from "@ciwallet-sdk/utils"

export interface ChainCardProps {
  platform: PlatformMetadata
  isSelected?: boolean
  onPress?: () => void
  isPressable?: boolean
}

export const ChainCard: React.FC<ChainCardProps> = ({ platform, isSelected = false, isPressable }) => {
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform.platform))
    const dispatch = useAppDispatch()
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
                            <div>
                                <div className="text-sm">{platform.name}</div>
                                <NomasSpacer y={2} />
                                <TokenIcons platform={platform.platform} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm">
                            {shortenAddress(selectedAccount?.accountAddress ?? "")}
                        </div>
                        <CaretRightIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>
        )
    }
    return (
        isPressable ? (
            <PressableMotion onClick={() => {
                dispatch(setSelectedPlatform(platform.platform))
                dispatch(setMyWalletsPage(MyWalletsPage.SelectAccount))
            }}>{content()}</PressableMotion>
        ) : (
            content()
        )
    )
}