import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { HDWallet } from "./HDWallet"
import { NomasButton, NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer } from "@/nomas/components"
import { PlusIcon } from "@phosphor-icons/react"

export const HDWalletSection = () => {
    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    return (
        <>
            <NomasCard isInner variant={NomasCardVariant.Dark}>
                <NomasCardBody scrollable scrollHeight={300} className="p-4">
                    <div className="flex flex-col gap-4">
                        {hdWallets.map((hdWallet) => <HDWallet key={hdWallet.id} hdWallet={hdWallet} />)}
                    </div>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasButton xlSize className="w-full" onClick={
                () => {
                // create hd wallet
                // todo
                }}>
                <PlusIcon />
            Add Wallet
            </NomasButton>
        </>
    )
}