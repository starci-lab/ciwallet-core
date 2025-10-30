import { MyWalletsPage, useAppSelector } from "@/nomas/redux"
import { AccountsPage } from "./AccountsPage"
import { ManagementPage } from "./ManagementPage"
import { SelectAccountPage } from "./SelectAccountPage"
import { HDWalletDetailsSection } from "./HDWalletDetailsSection"

export const MyWalletsScene = () => {
    const myWalletsPage = useAppSelector((state) => state.stateless.sections.myWallets.page)
    const renderPage = () => {
        switch (myWalletsPage) {
        case MyWalletsPage.Accounts:
            return <AccountsPage />
        case MyWalletsPage.Management:
            return <ManagementPage />
        case MyWalletsPage.SelectAccount:
            return <SelectAccountPage />
        case MyWalletsPage.HDWalletDetails:
            return <HDWalletDetailsSection />
        }
    }
    return renderPage()
}