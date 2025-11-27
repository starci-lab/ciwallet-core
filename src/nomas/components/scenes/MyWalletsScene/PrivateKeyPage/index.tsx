import { 
    MyWalletsPage, 
    setMyWalletsPage, 
    useAppDispatch, 
    useAppSelector 
} from "@/nomas/redux"
import { 
    NomasButton, 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasCardVariant, 
    NomasTextarea,
    NomasSpacer
} from "../../../extends"
import { Snippet } from "@/nomas/components/styled"

export const PrivateKeyPage = () => {
    const dispatch = useAppDispatch()
    const ephemeralPrivateKey = useAppSelector((state) => state.stateless.sections.myWallets.ephemeralPrivateKey)
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Your Private Key" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletPrivateKey))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4 break-all text-sm h-40">
                        {ephemeralPrivateKey}
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <div className="flex items-center gap-2 justify-center">
                    <Snippet
                        copyString={ephemeralPrivateKey}
                    />
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