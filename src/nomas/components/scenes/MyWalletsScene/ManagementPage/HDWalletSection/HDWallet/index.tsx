import React from "react"
import {  useAppDispatch, type HDWallet as HDWalletType, setHdWalletId, setMyWalletsPage, MyWalletsPage     } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import { PressableMotion } from "@/nomas/components"

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
                <div className="text-sm">{hdWallet.name}</div>
                <CaretRightIcon className="size-4" />
            </div>
        </PressableMotion>
    )
}