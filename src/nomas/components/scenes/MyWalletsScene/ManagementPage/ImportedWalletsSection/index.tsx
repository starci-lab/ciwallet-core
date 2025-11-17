import React from "react"
import { MyWalletsPage, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasButton, NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer } from "@/nomas/components"
import { PlusIcon } from "@phosphor-icons/react"
import { ImportedWallet } from "./ImportedWallet"

export const ImportedWalletsSection = () => {
    const importedWallets = useAppSelector((state) => state.persists.session.importedWallets)
    const dispatch = useAppDispatch()
    return (
        <>
            <NomasCard isInner variant={NomasCardVariant.Dark}>
                <NomasCardBody scrollable scrollHeight={300} className="p-0">
                    {importedWallets.map((importedWallet) => <ImportedWallet key={importedWallet.id} importedWallet={importedWallet} />)}
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasButton xlSize className="w-full" onClick={
                () => {
                    dispatch(setMyWalletsPage(MyWalletsPage.SelectWalletPlatform))
                }}>
                <PlusIcon />
            Add Wallet
            </NomasButton>
        </>
    )
}