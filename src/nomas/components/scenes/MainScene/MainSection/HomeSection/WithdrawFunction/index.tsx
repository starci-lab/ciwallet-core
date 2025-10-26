import React from "react"
import { WithdrawFunctionPage, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChooseNetworkPage } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks"
import { WithdrawPage as WithdrawPageComponent } from "./WithdrawPage"
import { roundNumber } from "@ciwallet-sdk/utils"

export const WithdrawFunction = () => {
    const withdrawFunctionPage = useAppSelector((state) => state.stateless.sections.home.withdrawFunctionPage)
    const formik = useTransferFormik()
    const dispatch = useAppDispatch()
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const network = useAppSelector((state) => state.persists.session.network)
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
                    endContent={
                        (chainId) => {
                            const chainTokens = tokens[chainId][network]
                            const totalValue = chainTokens.reduce(
                                (acc: number, token) => acc + (balances[token.tokenId] ?? 0) * (prices[token.tokenId] ?? 0), 0)
                            return (
                                <div>
                                    <div className="text-muted">${roundNumber(totalValue)}</div>
                                </div>
                            )
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