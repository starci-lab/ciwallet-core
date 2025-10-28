import React from "react"
import { TransactionType, WithdrawFunctionPage, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChooseNetworkPage, TransactionReceiptPage } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks"
import { WithdrawPageComponent } from "./WithdrawPage"
import { SelectTokenPage } from "./SelectTokenPage"

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
        case WithdrawFunctionPage.Withdraw: {
            return <WithdrawPageComponent /> 
        }
        case WithdrawFunctionPage.SelectToken: {
            return <SelectTokenPage />
        }
        case WithdrawFunctionPage.TransactionReceipt: {
            return <TransactionReceiptPage 
                transactionData={{
                    type: TransactionType.Withdrawal,
                    chainId: formik.values.chainId,
                    fromAddress: formik.values.toAddress,
                    toAddress: formik.values.toAddress,
                    tokenId: formik.values.tokenId,
                    amount: formik.values.amount,
                    txHash: "0x1234567890abcdef",
                }}
                success={true}
                showBackButton={true}
                onBackButtonPress={() => {
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                }}
                onProceedButtonClick={() => {
                    alert("Proceed")
                }}
            />
        }
        }
    }
    return renderPage()
}