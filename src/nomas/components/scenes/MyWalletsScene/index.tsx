import { MyWalletsPage, useAppSelector } from "@/nomas/redux"
import { AccountsPage } from "./AccountsPage"
import { ManagementPage } from "./ManagementPage"
import { SelectAccountPage } from "./SelectAccountPage"
import { HDWalletDetailsSection } from "./HDWalletDetailsSection"
import { SelectWalletPlatformPage } from "./SelectWalletPlatformPage"
import { InputPrivateKeyPage } from "./InputPrivateKeyPage"
import { SelectHDWalletCreationTypePage } from "./SelectHDWalletCreationTypePage"
import { ImportExistingHDWalletPage } from "./ImportExistingHDWalletPage"
import { CreateNewHDWalletPage } from "./CreateNewHDWalletPage"

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
        case MyWalletsPage.SelectWalletPlatform:
            return <SelectWalletPlatformPage />
        case MyWalletsPage.InputPrivateKey:
            return <InputPrivateKeyPage />
        case MyWalletsPage.SelectHDWalletCreationType:
            return <SelectHDWalletCreationTypePage />
        case MyWalletsPage.CreateNewHDWallet:
            return <CreateNewHDWalletPage />
        case MyWalletsPage.ImportExistingHDWallet:
            return <ImportExistingHDWalletPage />
        }
    }
    return renderPage()
}