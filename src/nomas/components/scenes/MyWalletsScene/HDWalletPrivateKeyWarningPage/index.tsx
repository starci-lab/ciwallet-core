import { KeyIcon, ShieldWarningIcon, WarningOctagonIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasCardVariant,
    NomasCheckbox,
    NomasDivider,
    NomasSpacer,
} from "../../../extends"
import { NomasButton } from "../../../extends/NomasButton"
import { MyWalletsPage, setIUnderstandHDWalletPrivateKeyWarning, setMyWalletsPage, useAppSelector } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"
export const HDWalletPrivateKeyWarningPage = () => {
    const dispatch = useAppDispatch()
    const iUnderstandHDWalletPrivateKeyWarning = useAppSelector((state) => state.stateless.sections.myWallets.iUnderstandHDWalletPrivateKeyWarning)
    const items = [
        {
            icon: KeyIcon,
            title: "Your private key is like the password to your account.",
        },
        {
            icon: EyeSlashIcon,
            title: "If someone gets it, they can drain your wallet. There's no way to recover lost funds.",
        },
        {
            icon: WarningOctagonIcon,
            title: "Never share it with anyone-no person, website, or app.",
        },
    ]
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Show Private Key" showBackButton onBackButtonPress={() => {
                dispatch(setIUnderstandHDWalletPrivateKeyWarning(false))
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4">
                        <div className="grid place-items-center gap-4">
                            <div className="w-18 h-18 rounded-full bg-danger/20 grid place-items-center">
                                <ShieldWarningIcon className="size-12 text-danger" />
                            </div>
                            <div className="text-lg">Keep Your Private Key Secret</div>
                        </div>
                        <NomasSpacer y={6} />
                        <div className="grid gap-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="w-[22px] h-[22px] min-w-[22px] min-h-[22px] rounded-sm bg-danger/20 grid place-items-center">
                                        <item.icon className="size-[14px] min-size-[14px] text-danger" />
                                    </div>
                                    <div className="text-sm text-text-muted">{item.title}</div>
                                </div>
                            ))}
                        </div>
                        <NomasSpacer y={12} />
                        <NomasDivider/>
                        <NomasSpacer y={4} />
                        <div className="flex gap-2">
                            <NomasCheckbox checked={iUnderstandHDWalletPrivateKeyWarning}
                                onCheckedChange={() => {
                                    dispatch(setIUnderstandHDWalletPrivateKeyWarning(!iUnderstandHDWalletPrivateKeyWarning))
                                }} />
                            <div className="text-sm text-text-muted">I understand that sharing my private key could result in the loss of my funds.</div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    isDisabled={!iUnderstandHDWalletPrivateKeyWarning}
                    className="w-full"
                    onClick={() => {
                        dispatch(setIUnderstandHDWalletPrivateKeyWarning(false))
                        dispatch(setMyWalletsPage(MyWalletsPage.HDWalletPrivateKey))
                    }}
                >
                            Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}