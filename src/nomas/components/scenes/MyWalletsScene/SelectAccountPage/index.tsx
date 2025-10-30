import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { MyWalletsPage, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj } from "@/nomas/obj"
import { AccountCard } from "./AccountCard"

export const SelectAccountPage = () => {
    const dispatch = useAppDispatch()
    const platforms = useMemo(() => {
        return chainManagerObj.getPlatformMetadatas()
    }, [])
    const selectedPlatform = useAppSelector((state) => state.stateless.sections.myWallets.selectedPlatform)
    const accounts = useAppSelector((state) => state.persists.session.accounts[selectedPlatform])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="w-full">
            <NomasCardHeader 
                title={`Select Account (${platforms.find((platform) => platform.platform === selectedPlatform)?.symbol})`} 
                showBackButton 
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
                }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-0 flex flex-col gap-2">
                        {accounts?.accounts.map((account) => (
                            <AccountCard 
                                key={account.id} 
                                accountId={account.id} 
                                accountAddress={account.accountAddress} 
                                isSelected
                                type={account.type}
                                refId={account.refId}
                            />
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}