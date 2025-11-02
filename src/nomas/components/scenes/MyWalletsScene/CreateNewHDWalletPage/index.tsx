import React from "react"
import { NomasCard, NomasCardHeader, NomasCardBody, NomasCardFooter, NomasButton } from "@/nomas/components"
import { NomasCardVariant } from "@/nomas/components"
import { setMyWalletsPage, useAppDispatch } from "@/nomas/redux"
import { MyWalletsPage } from "@/nomas/redux"
import { MnemonicInput } from "@/nomas/components/reusable"
import { useCreateMnemonicFormik } from "@/nomas/hooks"

export const CreateNewHDWalletPage = () => {
    const dispatch = useAppDispatch()
    const formik = useCreateMnemonicFormik()
    console.log(formik.errors)
    console.log(formik.values)
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader 
                title={"Create New Wallet"} 
                showBackButton 
                description={"Create a new wallet using a 24-word recovery phrase. You can either copy and paste or type manually."}
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.SelectWalletPlatform))
                }} />
            <NomasCardBody>
                <MnemonicInput 
                    mnemonic={formik.values.use24Words ? formik.values.mnemonic24 : formik.values.mnemonic12} 
                    setMnemonic={(mnemonic) => formik.setFieldValue(formik.values.use24Words ? "mnemonic24" : "mnemonic12", mnemonic)} 
                    use24Words={formik.values.use24Words} 
                    setUse24Words={(use24Words) => formik.setFieldValue("use24Words", use24Words)} 
                    isReadOnly={true}
                />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    disabled={!formik.isValid}
                    isLoading={formik.isSubmitting}
                    className="w-full"
                    onClick={async () => {
                        await formik.submitForm()
                    }}>
                    Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}