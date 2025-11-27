import { MyWalletsPage, useAppSelector } from "@/nomas/redux"
import { AccountsPage } from "./AccountsPage"
import { ManagementPage } from "./ManagementPage"
import { SelectAccountPage } from "./SelectAccountPage"
import { SelectWalletPlatformPage } from "./SelectWalletPlatformPage"
import { InputPrivateKeyPage } from "./InputPrivateKeyPage"
import { SelectHDWalletCreationTypePage } from "./SelectHDWalletCreationTypePage"
import { ImportExistingHDWalletPage } from "./ImportExistingHDWalletPage"
import { CreateNewHDWalletPage } from "./CreateNewHDWalletPage"
import { HDWalletDetailsPage } from "./HDWalletDetailsPage"
import { HDWalletRecoverPhaseWarningPage } from "./HDWalletRecoverPhaseWarningPage"
import { HDWalletRecoverPhasePage } from "./HDWalletRecoverPhasePage"
import { HDWalletAccountsPage } from "./HDWalletAccountsPage"
import { HDWalletPrivateKeyWarningPage } from "./HDWalletPrivateKeyWarningPage"
import { HDWalletPrivateKeyPage } from "./HDWalletPrivateKeyPage"
import { PrivateKeyPage } from "./PrivateKeyPage"
import { RemoveHDWalletWarningPage } from "./RemoveHDWalletWarningPage"
import { EditHDWalletPage } from "./EditHDWalletPage"

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
            return <HDWalletDetailsPage />
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
        case MyWalletsPage.HDWalletRecoverPhaseWarning:
            return <HDWalletRecoverPhaseWarningPage />
        case MyWalletsPage.HDWalletRecoverPhase:
            return <HDWalletRecoverPhasePage />
        case MyWalletsPage.HDWalletAccounts:
            return <HDWalletAccountsPage />
        case MyWalletsPage.HDWalletPrivateKeyWarning:
            return <HDWalletPrivateKeyWarningPage />
        case MyWalletsPage.HDWalletPrivateKey:
            return <HDWalletPrivateKeyPage />
        case MyWalletsPage.PrivateKey:
            return <PrivateKeyPage />
        case MyWalletsPage.RemoveHDWalletWarning:
            return <RemoveHDWalletWarningPage />
        case MyWalletsPage.EditHDWallet:
            return <EditHDWalletPage />
        }
    }
    return renderPage()
}