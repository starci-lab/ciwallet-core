import React from "react"
import { 
    NomasCard, 
    NomasCardBody, 
    NomasCardHeader, 
    NomasButtonIcon, 
    NomasDivider,
    NomasCardVariant
} from "../../../extends"
import { Bell, CopySimple, Gear } from "phosphor-react"
import { BalanceContent } from "../BalanceSection/BalanceConent"
import { useAppSelector } from "@/nomas/redux"

export const BalanceSection = () => {
    const accounts = useAppSelector((state) => state.persists.session.accounts)
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    const selectedAccountId = useAppSelector((state) => state.persists.session.accounts[chainId]?.selectedAccountId)
    const selectedAccount = accounts[chainId]?.accounts.find((account, index) => {
        // if no selected account id, return the first account
        if (!selectedAccountId) return index === 0
        // if selected account id, return the account with the selected account id
        return account.id === selectedAccountId
    })
    return (
        <NomasCard variant={NomasCardVariant.Gradient}>
            <NomasCardHeader>
                <div className="flex flex-row items-center gap-3">
                    <div className="relative">
                        <NomasButtonIcon>
                            <Bell className="w-5 h-5" />
                        </NomasButtonIcon>
                        {/* Notification dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-foreground-700"></div>
                    </div>
                    <div className="text text-sm">{selectedAccount?.name}</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <NomasButtonIcon>
                        <CopySimple />
                    </NomasButtonIcon>
                    <NomasButtonIcon>
                        <Gear />
                    </NomasButtonIcon>
                </div>
            </NomasCardHeader>
            <NomasDivider orientation="horizontal" className="w-4/5 mx-auto bg-foreground-600" />
            <NomasCardBody className="p-0">
                <BalanceContent />
            </NomasCardBody>
        </NomasCard>
    )
}