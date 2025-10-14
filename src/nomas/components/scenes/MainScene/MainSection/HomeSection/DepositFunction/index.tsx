import React from "react"
import { DepositFunctionPage, setDepositFunctionPage, setDepositSelectedChainId, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChooseNetworkPage } from "../../../../../styled"
import { DepositPage } from "./DepositPage"

export const DepositFunction = () => {
    const depositFunctionPage = useAppSelector((state) => state.stateless.sections.home.depositFunctionPage)
    const dispatch = useAppDispatch()
    const depositSelectedChainId = useAppSelector((state) => state.stateless.sections.home.depositSelectedChainId)
    const renderPage = () => {
        switch (depositFunctionPage) {
        case DepositFunctionPage.ChooseNetwork:
            return <ChooseNetworkPage
                isSelected={(chainId) => depositSelectedChainId === chainId} 
                showBackButton={false} 
                onBackButtonPress={() => {
                    dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                }} 
                onQRCodeClick={(chainId) => {
                    dispatch(setDepositSelectedChainId(chainId))
                    dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                }}
                onCopyClick={(chainId) => {
                    dispatch(setDepositSelectedChainId(chainId))
                }}
            />
        case DepositFunctionPage.Deposit:
            return <DepositPage />
        }
    }
    return renderPage()
}