import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasTextarea } from "@/nomas/components"
import { chainManagerObj } from "@/nomas/obj"
import { MyWalletsPage, useAppSelector } from "@/nomas/redux"
import { setMyWalletsPage, useAppDispatch } from "@/nomas/redux"
import React, { useMemo } from "react"
import { useInputPrivateKeyFormik } from "@/nomas/hooks"

export const InputPrivateKeyPage = () => {
    const dispatch = useAppDispatch()
    const platforms = useMemo(() => {
        return chainManagerObj.getPlatformMetadatas()
    }, [])
    const selectedPlatform = useAppSelector((state) => state.stateless.sections.myWallets.selectedPrivateKeyPlatform)
    const formik = useInputPrivateKeyFormik()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader 
                title={`Input Private Key (${platforms.find((platform) => platform.platform === selectedPlatform)?.symbol})`} 
                showBackButton 
                description={chainManagerObj.getPlatformDescriptions(selectedPlatform)}
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.SelectWalletPlatform))
                }} />
            <NomasCardBody>
                <NomasTextarea
                    placeholder="Enter your private key"
                    isRequired
                    value={formik.values.privateKey}
                    onValueChange={formik.handleChange("privateKey")}
                    onBlur={formik.handleBlur("privateKey")}
                    isInvalid={!!(formik.errors.privateKey && formik.touched.privateKey)}
                    errorMessage={formik.errors.privateKey}
                />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onClick={async () => await formik.submitForm()}>
                    Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}