import React from "react"
import {  useAppDispatch, setMyWalletsPage, MyWalletsPage, setSelectedImportedWalletId     } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import { PressableMotion } from "@/nomas/components"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import type { ImportedWallet as ImportedWalletType } from "@/nomas/redux"

export interface ImportedWalletProps {
    importedWallet: ImportedWalletType
}

export const ImportedWallet = ({ importedWallet }: ImportedWalletProps) => {
    const dispatch = useAppDispatch()
    return (
        <PressableMotion 
            className="flex items-center justify-between" 
            onClick={() => {
                dispatch(setSelectedImportedWalletId(importedWallet.id))
                dispatch(setMyWalletsPage(MyWalletsPage.ImportedWalletDetails))
            }}>
            <div className="flex items-center gap-2 justify-between w-full p-4">
                <div className="flex items-center gap-2">
                    <Jazzicon diameter={40} seed={jsNumberForAddress(importedWallet.id)} />
                    <div className="flex flex-col">
                        <div className="text-sm">{importedWallet.name}</div>
                        <div className="text-xs text-muted">$0</div>
                    </div>
                </div>
                <CaretRightIcon className="size-4" />
            </div>
        </PressableMotion>
    )
}