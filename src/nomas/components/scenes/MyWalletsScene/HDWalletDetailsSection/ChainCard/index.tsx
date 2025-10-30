import React from "react"
import { NomasSpacer } from "../../../../extends"
import { selectAccountsByHdWalletId, useAppSelector } from "@/nomas/redux"
import { PressableMotion, TokenIcons } from "../../../../styled"
import type { PlatformMetadata } from "@ciwallet-sdk/types"
import { shortenAddress } from "@ciwallet-sdk/utils"

export interface ChainCardProps {
  platform: PlatformMetadata
}

export const ChainCard: React.FC<ChainCardProps> = ({ platform }) => {
    const hdWalletId = useAppSelector((state) => state.stateless.sections.myWallets.hdWalletId)
    const accounts = useAppSelector((state) => selectAccountsByHdWalletId(state.persists, hdWalletId))
    const content = () => {
        return (
            <div>
                <div className="p-4 flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex items-center gap-2">
                            <div>
                                <div className="text-sm">{platform.name}</div>
                                <NomasSpacer y={2} />
                                <TokenIcons platform={platform.platform} />
                            </div>
                        </div>
                    </div>
                    <div className="text-sm">
                        {shortenAddress(accounts.find((account) => account.platform === platform.platform)?.accountAddress ?? "")}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <PressableMotion onClick={() => {
            // copy to clipboard
            navigator.clipboard.writeText(accounts.find((account) => account.platform === platform.platform)?.accountAddress ?? "")
        }}>{content()}</PressableMotion>
    )
}