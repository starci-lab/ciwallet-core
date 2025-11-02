import React from "react"
import { NomasCard, NomasCardHeader, NomasCardBody, NomasCardFooter, NomasButton } from "@/nomas/components"
import { NomasCardVariant } from "@/nomas/components"
import { setMyWalletsPage, useAppDispatch } from "@/nomas/redux"
import { MyWalletsPage } from "@/nomas/redux"
import { MnemonicInput } from "@/nomas/components/reusable"
import { useInputMnemonicFormik } from "@/nomas/hooks"

export const ImportExistingHDWalletPage = () => {
    const dispatch = useAppDispatch()
    const formik = useInputMnemonicFormik()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader 
                title={"Import Existing Wallet"} 
                showBackButton 
                description={"Import an existing wallet using a 12 or 24-word recovery phrase. You can either copy and paste or type manually."}
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.SelectWalletPlatform))
                }} />
            <NomasCardBody>
                <MnemonicInput 
                    mnemonic={formik.values.mnemonic} 
                    setMnemonic={(mnemonic) => formik.setFieldValue("mnemonic", mnemonic)} 
                    use24Words={formik.values.use24Words} 
                    setUse24Words={(use24Words) => formik.setFieldValue("use24Words", use24Words)} 
                />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onClick={async () => {
                        await formik.submitForm()
                    }}>
                    Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}