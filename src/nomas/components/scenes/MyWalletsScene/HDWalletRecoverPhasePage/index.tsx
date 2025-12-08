import { MnemonicReadonly } from "@/nomas/components/reusable"
import { NomasButton, NomasCard, NomasCardFooter, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasSpacer } from "../../../extends"
import { selectHdWalletById, useAppSelector } from "@/nomas/redux"
import useSWR from "swr"
import { encryptionObj } from "@/nomas/obj"
import { setMyWalletsPage } from "@/nomas/redux"
import { MyWalletsPage } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"
import { Snippet } from "@/nomas/components/styled"

export const HDWalletRecoverPhasePage = () => {
    const dispatch = useAppDispatch()
    const hdWalletId = useAppSelector((state) => state.stateless.sections.myWallets.hdWalletId)
    const hdWallet = useAppSelector((state) => selectHdWalletById(state.persists, hdWalletId))
    const password = useAppSelector((state) => state.persists.session.password)
    const { data: mnemonic } = useSWR("DECRYPT_HD_WALLET", async () => {
        const response = await encryptionObj.decrypt(hdWallet?.encryptedMnemonic || "", password || "")
        return response
    })
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="My Recovery Phrase" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4">
                        <MnemonicReadonly
                            mnemonic={mnemonic || ""}
                        />
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <div className="flex items-center gap-2 justify-center">
                    <Snippet copyString={mnemonic || ""} />
                    <div className="text-sm text-text-muted">Copy to clipboard</div>
                </div>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    onClick={() => {
                        dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
                    }}>
                    Done
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}