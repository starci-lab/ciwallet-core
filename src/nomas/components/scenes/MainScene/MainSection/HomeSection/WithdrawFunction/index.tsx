import React from "react"
import { 
    TransactionType, 
    WithdrawFunctionPage, 
    selectSelectedAccounts, 
    selectTokens, 
    setWithdrawFunctionPage, 
    useAppDispatch, 
    useAppSelector 
} from "@/nomas/redux"
import { ChooseNetworkPage, TransactionReceiptPage } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks"
import { WithdrawPageComponent } from "./WithdrawPage"
import { SelectTokenPage } from "./SelectTokenPage"
import { TokenType } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { chainManagerObj } from "@/nomas/obj"

export const WithdrawFunction = () => {
    const withdrawFunctionPage = useAppSelector((state) => state.stateless.sections.home.withdrawFunctionPage)
    const formik = useTransferFormik()
    const dispatch = useAppDispatch()
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const network = useAppSelector((state) => state.persists.session.network)
    const renderPage = () => {
        switch (withdrawFunctionPage) {
        case WithdrawFunctionPage.ChooseNetwork:
            return (
                <ChooseNetworkPage
                    isSelected={(chainId) => formik.values.chainId === chainId} 
                    showBackButton={true}
                    isPressable={true}
                    onSearchQueryChange={(query) => {
                        formik.setFieldValue("searchTokenQuery", query)
                    }}
                    searchQuery={formik.values.searchTokenQuery}
                    withAllNetworks={true}
                    onPress={(chainId) => {
                        formik.setFieldValue("chainId", chainId)
                        const filteredTokenArray = tokenArray.filter((token) => {
                            return (
                                token.name.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
                                || token.symbol.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
                                || token.address?.toLowerCase()?.includes(formik.values.searchTokenQuery.toLowerCase())
                            ) && (token.chainId === chainId)
                        })
                        if (filteredTokenArray.length) {
                            const token = filteredTokenArray[0]
                            formik.setFieldValue("tokenId", token.tokenId)
                            const gasToken = tokenArray.find((_token) => 
                                _token.chainId === token.chainId
                                && _token.network === network 
                                && _token.type === TokenType.Native
                            )
                            formik.setFieldValue("gasTokenId", gasToken?.tokenId)
                        } else {
                            formik.setFieldValue("tokenId", undefined)
                        }
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
            const token = tokenArray.find((token) => token.tokenId === formik.values.tokenId)
            if (!token) return null
            const chainMetadata = chainManagerObj.getChainById(token.chainId)
            if (!chainMetadata) return null
            return <TransactionReceiptPage 
                transactionData={{
                    type: TransactionType.Withdrawal,
                    chainId: token.chainId,
                    fromAddress: selectedAccounts[chainIdToPlatform(token.chainId)]?.accountAddress ?? "",
                    toAddress: formik.values.toAddress,
                    tokenId: token.tokenId,
                    amount: formik.values.amount,
                    txHash: formik.values.txHash,
                }}
                success={true}
                showBackButton={true}
                onBackButtonPress={() => {
                    // reset the form
                    formik.resetForm()
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                }}
                onProceedButtonClick={() => {
                    // reset the form
                    formik.resetForm()
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                }}
            />
        }
        }
    }
    return renderPage()
}