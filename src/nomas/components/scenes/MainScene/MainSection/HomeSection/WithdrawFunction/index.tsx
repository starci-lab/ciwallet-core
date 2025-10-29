import React from "react"
import { HomeSelectorTab, PortfolioFunctionPage, TransactionType, WithdrawFunctionPage, selectSelectedAccountByPlatform, setHomeSelectorTab, setPortfolioFunctionPage, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChooseNetworkPage, TransactionReceiptPage } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks"
import { WithdrawPageComponent } from "./WithdrawPage"
import { SelectTokenPage } from "./SelectTokenPage"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const WithdrawFunction = () => {
    const withdrawFunctionPage = useAppSelector((state) => state.stateless.sections.home.withdrawFunctionPage)
    const formik = useTransferFormik()
    const dispatch = useAppDispatch()
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, chainIdToPlatform(formik.values.chainId)))
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
                    fromAddress: selectedAccount?.accountAddress ?? "",
                    toAddress: formik.values.toAddress,
                    tokenId: formik.values.tokenId,
                    amount: formik.values.amount,
                    txHash: formik.values.txHash,
                }}
                success={true}
                showBackButton={true}
                onBackButtonPress={() => {
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                }}
                onProceedButtonClick={() => {
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                    dispatch(setHomeSelectorTab(HomeSelectorTab.Portfolio))
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.Portfolio))
                }}
            />
        }
        }
    }
    return renderPage()
}