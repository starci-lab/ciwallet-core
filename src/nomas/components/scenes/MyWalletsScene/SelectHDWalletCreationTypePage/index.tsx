import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasSpacer } from "@/nomas/components"
import { HDWalletCreationType, MyWalletsPage, setMyWalletsPage, setSelectedHDWalletCreationType, useAppDispatch } from "@/nomas/redux"
import { PressableMotion } from "@/nomas/components/styled"
import { SparkleIcon, UploadSimpleIcon } from "@phosphor-icons/react"
import { useCreateMnemonicFormik } from "@/nomas/hooks"
import { mnemonicObj } from "@/nomas/obj"

export const SelectHDWalletCreationTypePage = () => {
    const dispatch = useAppDispatch()
    const formik = useCreateMnemonicFormik()
    const walletTypes = useMemo(() => {
        return [
            {
                label: "Create New Wallet",
                value: HDWalletCreationType.CreateNewWallet,
                description: "Recommended for first-time users or when you want a new recovery phrase. A new 24 word mnemonic will be generated securely inside Nomas.",
                icon: <SparkleIcon className="size-8" />,
            },
            {
                label: "Import Existing Wallet",
                value: HDWalletCreationType.ImportExistingWallet,
                description: "Use this if you already have a wallet from MetaMask, Phantom, Sui Wallet, etc. You can import using your seed phrase or private key.",
                icon: <UploadSimpleIcon className="size-8" />,
            }
        ]
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Create or Import Wallet" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.Management))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4 flex flex-col gap-2" scrollable scrollHeight={300}>
                        {walletTypes.map((walletType) => (
                            <PressableMotion 
                                key={walletType.value}
                                onClick={() => {
                                    dispatch(setSelectedHDWalletCreationType(walletType.value))
                                    dispatch(setMyWalletsPage(walletType.value === HDWalletCreationType.CreateNewWallet ? MyWalletsPage.CreateNewHDWallet : MyWalletsPage.ImportExistingHDWallet))
                                    if (walletType.value === HDWalletCreationType.CreateNewWallet) {
                                        const mnemonic12 = mnemonicObj.generate(false)
                                        formik.setFieldValue("mnemonic12", mnemonic12)
                                        const mnemonic24 = mnemonicObj.generate(true)
                                        formik.setFieldValue("mnemonic24", mnemonic24)
                                        formik.setFieldValue("use24Words", true)
                                    }
                                }}>
                                <div className="flex items-center gap-2">
                                    {walletType.icon}
                                    <div className="w-full justify-start block h-full p-4">
                                        <div className="p-0 flex items-center gap-2 justify-between w-full">
                                            <div className="text-sm">{walletType.label}</div>
                                        </div>
                                        <NomasSpacer y={2} />
                                        <div className="text-xs text-muted">
                                            {walletType.description}
                                        </div>
                                    </div>
                                </div>
                            </PressableMotion>
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}   