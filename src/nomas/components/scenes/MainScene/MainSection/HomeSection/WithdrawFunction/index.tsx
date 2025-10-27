import React from "react"
import { WithdrawFunctionPage, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChooseNetworkPage } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks"
import { WithdrawPage as WithdrawPageComponent } from "./WithdrawPage"

export const WithdrawFunction = () => {
    const withdrawFunctionPage = useAppSelector((state) => state.stateless.sections.home.withdrawFunctionPage)
    const formik = useTransferFormik()
    const dispatch = useAppDispatch()
    const renderPage = () => {
        switch (withdrawFunctionPage) {
        case WithdrawFunctionPage.ChooseNetwork:
            return (
                <ChooseNetworkPage
                    isSelected={(chainId) => formik.values.chainId === chainId} 
                    showBackButton={true}
                    isPressable={true}
                    onPress={(chainId) => {
                        formik.setFieldValue("chainId", chainId)
                        dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                    }}
                    onBackButtonPress={() => {
                        dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                    }}
                />
            )
        case WithdrawFunctionPage.Withdraw:
            return <WithdrawPageComponent />
        }
    }
    return renderPage()
}