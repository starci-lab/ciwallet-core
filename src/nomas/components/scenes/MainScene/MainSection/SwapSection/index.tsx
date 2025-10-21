import React from "react"
import { ChooseNetworkPage, NomasCard, NomasCardVariant } from "@/nomas/components"
import { SwapFunctionPage, setSwapFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasAggregationPage } from "./NomasAggregationFunction"
import { SwapFunction } from "./SwapFunction"
import { useSwapFormik } from "@/nomas/hooks"
import { SelectTokenFunction } from "./SelectTokenFunction"
export const SwapSection = () => {
    const swapPage = useAppSelector((state) => state.stateless.sections.swap.swapFunctionPage)
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    const renderPage = () => {
        switch (swapPage) {
        case SwapFunctionPage.Swap:
            return <SwapFunction />
        case SwapFunctionPage.SelectToken:
            return <SelectTokenFunction />
        case SwapFunctionPage.NomasAggregation:
            return <NomasAggregationPage />
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
