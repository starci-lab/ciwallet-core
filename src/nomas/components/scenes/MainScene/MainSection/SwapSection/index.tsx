import React from "react"
import { ChooseNetworkPage, NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapFunctionPage, TransactionType, setSwapFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasAggregationPage } from "./NomasAggregationFunction"
import { SwapFunction } from "./SwapFunction"
import { useSwapFormik } from "@/nomas/hooks"
import { SelectTokenFunction } from "./SelectTokenFunction"
import { SlippageConfigFunction } from "./SlippageConfigFunction"
import { TransactionReceiptPage } from "@/nomas/components"
import { AggregatorId } from "@ciwallet-sdk/classes"

export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.sections.swap.swapFunctionPage)
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    const renderPage = () => {
        switch (swapPage) {
        case SwapFunctionPage.TransactionReceipt:
            return <TransactionReceiptPage 
                transactionData={{
                    type: TransactionType.Swap,
                    chainId: formik.values.tokenInChainId,
                    fromTokenId: formik.values.tokenOut,
                    toTokenId: formik.values.tokenIn,
                    fromAddress: "0xa",
                    toAddress: "0xb",
                    amount: 100,
                    aggregatorId: AggregatorId.Madhouse,
                    txHash: "0x1234567890abcdef",
                }}
                success={false}
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
            />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}
