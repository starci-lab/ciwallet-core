import React, { useMemo } from "react"
import { ChooseNetworkPage, NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapFunctionPage, TransactionType, selectSelectedAccounts, setSearchQuery, setSwapFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasAggregationPage } from "./NomasAggregationFunction"
import { SwapFunction } from "./SwapFunction"
import { useSwapFormik } from "@/nomas/hooks"
import { SelectTokenFunction } from "./SelectTokenFunction"
import { SlippageConfigFunction } from "./SlippageConfigFunction"
import { TransactionReceiptPage } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { TokenId } from "@ciwallet-sdk/types"

export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.sections.swap.swapFunctionPage)
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    const swapSuccess = useAppSelector((state) => state.stateless.sections.swap.swapSuccess)
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const transactionType = useAppSelector((state) => state.stateless.sections.swap.transactionType)
    const searchQuery = useAppSelector((state) => state.stateless.sections.swap.searchQuery)
    const txHash = useAppSelector((state) => state.stateless.sections.swap.txHash)
    const transactionData = useMemo(() => {
        switch (transactionType) {
        case TransactionType.Swap:
            return {
                type: transactionType,
                chainId: formik.values.tokenInChainId,
                fromTokenId: formik.values.tokenIn ?? TokenId.MonadTestnetMon,
                toTokenId: formik.values.tokenOut ?? TokenId.MonadTestnetMon,
                fromAddress: selectedAccounts[chainIdToPlatform(formik.values.tokenInChainId)]?.accountAddress ?? "",
                toAddress: selectedAccounts[chainIdToPlatform(formik.values.tokenOutChainId)]?.accountAddress ?? "",
                fromAmount: Number(formik.values.amountIn),
                toAmount: Number(formik.values.amountOut),
                aggregatorId: formik.values.bestAggregationId,
                txHash,
            }
        case TransactionType.Bridge:
            return {
                type: transactionType,
                fromTokenId: formik.values.tokenIn ?? TokenId.MonadTestnetMon,
                toTokenId: formik.values.tokenOut ?? TokenId.MonadTestnetMon,
                fromChainId: formik.values.tokenInChainId,
                toChainId: formik.values.tokenOutChainId,
                fromAmount: Number(formik.values.amountIn),
                toAmount: Number(formik.values.amountOut),
                fromAddress: selectedAccounts[chainIdToPlatform(formik.values.tokenInChainId)]?.accountAddress ?? "",
                toAddress: selectedAccounts[chainIdToPlatform(formik.values.tokenOutChainId)]?.accountAddress ?? "",
                txHash,
                aggregatorId: formik.values.bestAggregationId,
            }
        default:
            throw new Error(`Transaction type ${transactionType} not supported`)
        }

    }, [transactionType, formik.values, txHash])
    const renderPage = () => {
        switch (swapPage) {
        case SwapFunctionPage.TransactionReceipt:
            return <TransactionReceiptPage 
                transactionData={transactionData}
                success={swapSuccess}
                showBackButton={true}
                onBackButtonPress={() => {
                    formik.resetForm()
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
                onProceedButtonClick={() => {
                    formik.resetForm()
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
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
                onSearchQueryChange={(query) => {
                    dispatch(setSearchQuery(query))
                }}
                searchQuery={searchQuery}
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
            />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient} isContainer>{renderPage()}</NomasCard>
}
