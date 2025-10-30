import React, { useEffect } from "react"
import { MyWalletsManagementTab, MyWalletsPage, setInitialized, setManagementTab, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasSpacer, NomasTab } from "../../../extends"
import { HDWalletSection } from "./HDWalletSection"
export const ManagementPage = () => {
    const dispatch = useAppDispatch()
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    useEffect(() => {
        if (!initialized) {
            dispatch(setInitialized(true))
        }
    }, [])

    const managementTab = useAppSelector((state) => state.stateless.sections.myWallets.managementTab)
    const renderManagementTab = () => {
        switch (managementTab) {
        case MyWalletsManagementTab.HDWallets:
            return <HDWalletSection />
        case MyWalletsManagementTab.ImportedWallets:
            return <div>Imported Wallets</div>
        }
    }
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader 
                title="Manage Wallets" 
                showBackButton 
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
                }} />
            <NomasCardBody>
                <NomasTab
                    tabs={[{
                        label: "HD Wallets",
                        value: MyWalletsManagementTab.HDWallets,
                    }, {
                        label: "Imported Wallets",
                        value: MyWalletsManagementTab.ImportedWallets,
                    }]}
                    value={managementTab}
                    onValueChange={(value) => {
                        dispatch(setManagementTab(value as MyWalletsManagementTab))
                    }}
                />
                <NomasSpacer y={6} />
                {renderManagementTab()}
            </NomasCardBody>
        </NomasCard>
    )
}