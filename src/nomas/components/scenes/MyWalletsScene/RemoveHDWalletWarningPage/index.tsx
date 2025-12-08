import { NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasSpacer } from "../../../extends"
import { NomasButton } from "../../../extends/NomasButton"
import { MyWalletsPage, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { selectHdWalletById } from "@/nomas/redux"
import { TrashIcon } from "@phosphor-icons/react"

export const RemoveHDWalletWarningPage = () => {
    const dispatch = useAppDispatch()
    const hdWalletId = useAppSelector((state) => state.stateless.sections.myWallets.hdWalletId)
    const hdWallet = useAppSelector((state) => selectHdWalletById(state.persists, hdWalletId))
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Remove" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
                <div className="grid place-items-center gap-4">
                    <div className="w-18 h-18 rounded-full bg-danger/20 grid place-items-center">
                        <TrashIcon className="size-12 text-danger" />
                    </div>
                    <div className="text-lg">Are you sure you want to remove {hdWallet?.name}?</div>
                </div>
                <NomasSpacer y={4} />
                <div className="text-text-muted text-sm text-center">This action cannot be undone.</div>
                <NomasSpacer y={12} />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    onClick={
                        async () => {
                            dispatch(setMyWalletsPage(MyWalletsPage.Management))
                        }}>
                    Remove
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}