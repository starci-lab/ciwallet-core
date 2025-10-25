import React from "react"
import { ChooseNetworkPage, NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapFunctionPage, TransactionType, setSwapFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasAggregationPage } from "./NomasAggregationFunction"
import { SwapFunction } from "./SwapFunction"
import { useSwapFormik } from "@/nomas/hooks"
import { SelectTokenFunction } from "./SelectTokenFunction"
import { SlippageConfigFunction } from "./SlippageConfigFunction"
import { TransactionReceiptPage } from "@/nomas/components"

export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.sections.swap.swapFunctionPage)
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    const transactionData = useAppSelector((state) => state.stateless.sections.swap.transactionData)
    const renderPage = () => {
        switch (swapPage) {
        case SwapFunctionPage.TransactionReceipt:
            return <TransactionReceiptPage 
                type={TransactionType.Swap}
                transactionData={transactionData}
                showBackButton={true}
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
                onProceedButtonClick={() => {
                    alert("Proceed")
                }}
            />
        case SwapFunctionPage.Swap:
            return <SwapFunction />
        case SwapFunctionPage.SelectToken:
            return <SelectTokenFunction />
        case SwapFunctionPage.NomasAggregation:
            return <NomasAggregationPage />
        case SwapFunctionPage.SlippageConfig:
            return <SlippageConfigFunction />
        case SwapFunctionPage.ChooseNetwork:
            return <ChooseNetworkPage
                isSelected={(chainId) => formik.values.tokenInChainId === chainId} 
                showBackButton={true} 
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }} 
                onQRCodeClick={(chainId) => {
                    console.log(chainId)
                }}
                onCopyClick={(chainId) => {
                    console.log(chainId)
                }}
            />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}
