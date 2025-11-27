import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasImage } from "../../../extends"
import { MyWalletsPage, setMyWalletsPage } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"

export const EditHDWalletPage = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Manage Profile" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
            </NomasCardBody>
        </NomasCard>
    )
}