import React from "react"
import {  useAppDispatch, type HDWallet as HDWalletType, setHdWalletId, setMyWalletsPage, MyWalletsPage     } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import { PressableMotion } from "@/nomas/components"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
export interface HDWalletProps {
    hdWallet: HDWalletType
}

export const HDWallet = ({ hdWallet }: HDWalletProps) => {
    const dispatch = useAppDispatch()
    return (
        <PressableMotion 
            className="flex items-center justify-between" 
            onClick={() => {
                dispatch(setHdWalletId(hdWallet.id))
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }}>
            <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                    <Jazzicon diameter={40} seed={jsNumberForAddress(hdWallet.id)} />
                    <div className="flex flex-col">
                        <div className="text-sm">{hdWallet.name}</div>
                        <div className="text-xs text-muted">$0</div>
                    </div>
                </div>
                <CaretRightIcon className="size-4" />
            </div>
        </PressableMotion>
    )
}