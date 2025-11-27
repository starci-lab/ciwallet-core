import { PressableMotion } from "../../../styled"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
    NomasSpacer
} from "../../../extends"
import { MyWalletsPage, selectHdWalletById, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"

export const HDWalletDetailsPage = () => {
    const dispatch = useAppDispatch()
    const hdWalletId = useAppSelector((state) => state.stateless.sections.myWallets.hdWalletId)
    const hdWallet = useAppSelector((state) => selectHdWalletById(state.persists, hdWalletId))
    return <NomasCard variant={NomasCardVariant.Gradient} isContainer>
        <NomasCardHeader title={hdWallet?.name} showBackButton onBackButtonPress={() => {
            dispatch(setMyWalletsPage(MyWalletsPage.Management))
        }} />
        <NomasCardBody>
            <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                <NomasCardBody className="p-4">
                    <PressableMotion
                        className="flex items-center justify-between"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.EditHDWallet))
                        }}>
                        <div className="flex items-center gap-2 justify-between w-full">
                            <div className="flex items-center gap-2">
                                <Jazzicon diameter={40} seed={jsNumberForAddress(hdWallet?.id ?? "")} />
                                <div className="flex flex-col">
                                    <div className="text-sm">{hdWallet?.name}</div>
                                    <div className="text-xs text-muted">0$</div>
                                </div>
                            </div>
                            <CaretRightIcon className="size-4 text-text-muted" />
                        </div>
                    </PressableMotion>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4 gap-4 grid">
                    <PressableMotion
                        className="flex items-center justify-between py-1"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.HDWalletAccounts))
                        }}>
                        <div className="text-sm">Manage Accounts</div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                    <PressableMotion
                        className="flex items-center justify-between py-1"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.HDWalletRecoverPhaseWarning))
                        }}>
                        <div className="text-sm">Show Recovery Phrase</div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                    <PressableMotion
                        className="flex items-center justify-between py-1"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.HDWalletPrivateKeyWarning))
                        }}>
                        <div className="text-sm">Show Private Key</div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4 gap-4 grid">
                    <PressableMotion
                        className="flex items-center justify-between py-1"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.EditHDWallet))
                        }}>
                        <div className="text-sm">Backup</div>
                        <CaretRightIcon className="size-4 text-text-muted" />
                    </PressableMotion>
                </NomasCardBody>
            </NomasCard>
            <NomasSpacer y={6} />
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="p-4 gap-4 grid">
                    <PressableMotion
                        className="flex items-center justify-between py-1"
                        onClick={() => {
                            dispatch(setMyWalletsPage(MyWalletsPage.RemoveHDWalletWarning))
                        }}>
                        <div className="text-sm text-danger">Remove Wallet</div>
                    </PressableMotion>
                </NomasCardBody>
            </NomasCard>
        </NomasCardBody>
    </NomasCard >
}