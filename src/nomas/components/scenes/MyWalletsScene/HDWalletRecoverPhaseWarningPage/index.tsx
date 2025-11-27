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
import { MyWalletsPage, setIUnderstandHDWalletRecoverPhaseWarning, setMyWalletsPage, useAppSelector } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"
export const HDWalletRecoverPhaseWarningPage = () => {
    const dispatch = useAppDispatch()
    const iUnderstandHDWalletRecoverPhaseWarning = useAppSelector((state) => state.stateless.sections.myWallets.iUnderstandHDWalletRecoverPhaseWarning)
    const items = [
        {
            icon: KeyIcon,
            title: "Your secret recovery phrase is like a master key to your wallet.",
        },
        {
            icon: EyeSlashIcon,
            title: "If someone gets it, they can steal your funds. There's no way to recover lost funds.",
        },
        {
            icon: WarningOctagonIcon,
            title: "Never share it with anyone-no person, website, or app.",
        },
    ]
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Show Recovery Phrase" showBackButton onBackButtonPress={() => {
                dispatch(setIUnderstandHDWalletRecoverPhaseWarning(false))
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4">
                        <div className="grid place-items-center gap-4">
                            <div className="w-18 h-18 rounded-full bg-danger/20 grid place-items-center">
                                <ShieldWarningIcon className="size-12 text-danger" />
                            </div>
                            <div className="text-lg">Keep Your Recovery Phrase Secret</div>
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
                            <NomasCheckbox checked={iUnderstandHDWalletRecoverPhaseWarning}
                                onCheckedChange={() => {
                                    dispatch(setIUnderstandHDWalletRecoverPhaseWarning(!iUnderstandHDWalletRecoverPhaseWarning))
                                }} />
                            <div className="text-sm text-text-muted">I understand that sharing my recovery phase could result in the loss of my funds.</div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    isDisabled={!iUnderstandHDWalletRecoverPhaseWarning}
                    className="w-full"
                    onClick={() => {
                        dispatch(setIUnderstandHDWalletRecoverPhaseWarning(false))
                        dispatch(setMyWalletsPage(MyWalletsPage.HDWalletRecoverPhase))
                    }}
                >
                            Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}