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
import { roundNumber } from "@ciwallet-sdk/utils"

export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.sections.swap.swapFunctionPage)
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    const network = useAppSelector((state) => state.persists.session.network)
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
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
                withAllNetworks={true}
                isSelected={(chainId) => formik.values.searchSelectedChainId === chainId} 
                showBackButton={true} 
                isPressable={true}
                onPress={(chainId) => {
                    formik.setFieldValue("searchSelectedChainId", chainId)
                    dispatch(setSwapFunctionPage(SwapFunctionPage.SelectToken))
                }}
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
                endContent={
                    (chainId) => {
                        if (chainId === "all-network") {
                            throw new Error("All networks not supported")
                        }
                        const chainTokens = tokens[chainId][network]
                        const totalValue = chainTokens.reduce(
                            (acc: number, token) => acc + (balances[token.tokenId] ?? 0) * (prices[token.tokenId] ?? 0), 0)
                        return (
                            <div className="text-sm">${roundNumber(totalValue)}</div>
                        )
                    }}
            />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}
