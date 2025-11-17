import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { HDWallet } from "./HDWallet"
import { NomasButton, NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer } from "@/nomas/components"
import { PlusIcon } from "@phosphor-icons/react"
import { setMyWalletsPage } from "@/nomas/redux"
import { MyWalletsPage } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"

export const HDWalletSection = () => {
    const dispatch = useAppDispatch()
    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    return (
        <>
            <NomasCard isInner variant={NomasCardVariant.Dark}>
                <NomasCardBody scrollable scrollHeight={300} className="p-0">
                    <div className="flex flex-col">
                        {hdWallets.map((hdWallet) => <HDWallet key={hdWallet.id} hdWallet={hdWallet} />)}
                    </div>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasButton xlSize className="w-full" onClick={
                () => {
                    dispatch(setMyWalletsPage(MyWalletsPage.SelectHDWalletCreationType))
                }}>
                <PlusIcon />
            Add Wallet
            </NomasButton>
        </>
    )
}