import React from "react"
import { DepositFunctionPage, setDepositFunctionPage, setDepositSelectedChainId, setDepositTokenId, useAppDispatch, useAppSelector } from "@/nomas/redux"
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
                isPressable
                isSelected={(chainId) => depositSelectedChainId === chainId} 
                showBackButton={false} 
                onBackButtonPress={() => {
                    dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                }} 
                onPress={(chainId) => {
                    if (chainId === "all-network") {
                        throw new Error("All networks not supported")
                    }
                    dispatch(setDepositTokenId(undefined))
                    dispatch(setDepositSelectedChainId(chainId))
                    dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                }}
            />
        case DepositFunctionPage.Deposit:
            return <DepositPage />
        }
    }
    return renderPage()
}