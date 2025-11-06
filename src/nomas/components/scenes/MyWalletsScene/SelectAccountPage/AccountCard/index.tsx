import { PressableMotion } from "@/nomas/components"
import React from "react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import { PlatformAccountType, useAppSelector } from "@/nomas/redux"

export interface AccountCardProps {
    accountId: string
    accountAddress: string
    onClick?: () => void
    isSelected?: boolean
    type?: PlatformAccountType
    refId?: string
}
export const AccountCard = ({ accountAddress, onClick, isSelected = false, type, refId }: AccountCardProps) => {
    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    const importedWallets = useAppSelector((state) => state.persists.session.importedWallets)
    const renderChip = () => {
        switch (type) {
        case PlatformAccountType.HDWallet:
            return (
                <div className="text-xs text-muted">
                    HD Wallet
                </div>
            )
        case PlatformAccountType.ImportedWallet:
            return (
                <div className="text-xs text-muted">
                    Imported Wallet
                </div>
            )
        default:
            return null
        }
    }
    // render the name of the wallet
    const renderWalletName = () => {
        switch (type) {
        case PlatformAccountType.HDWallet: {
            return (
                <div className="text-sm">
                    {hdWallets.find((hdWallet) => hdWallet.id === refId)?.name}
                </div>
            )
        }
        case PlatformAccountType.ImportedWallet: {
            return (
                <div className="text-sm">
                    {importedWallets.find((importedWallet) => importedWallet.id === refId)?.name}
                </div>
            )
        }
        default:
            return null
        }
    }
    return (
        <PressableMotion onClick={onClick} className="justify-between flex w-full">
            <div className={
                twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                    isSelected ? "py-4 bg-button-dark-nohover border-border-cardshadow-button" : "bg-card-foreground transition-colors !shadow-none")
            }>
                <div className="flex items-center gap-2">
                    <Jazzicon diameter={40} seed={jsNumberForAddress(accountAddress)} />
                    <div>
                        {renderWalletName()}
                        {renderChip()}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-text">{shortenAddress(accountAddress)}</div>
                </div>
            </div>  
        </PressableMotion>
    )
}