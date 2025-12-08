import type { FormikProps } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import { protocolManagerObj } from "@/nomas/obj"
import { selectSelectedAccounts, selectTokens, useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"
import { TIMEOUT_QUOTE } from "@ciwallet-sdk/constants"
import Decimal from "decimal.js"
import { useBatchAggregatorSwrMutation } from "../mixin"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const useAggregatorSelector = (formik: FormikProps<SwapFormikValues>) => {
    // we try to determine the token in/out to select the best aggregator
    const tokenInChainId = formik.values.tokenInChainId
    const tokenOutChainId = formik.values.tokenOutChainId
    const network = useAppSelector(state => state.persists.session.network)
    const swrMutation = useBatchAggregatorSwrMutation()
    const tokenArray = useAppSelector(state => selectTokens(state.persists))
    const selectedAccounts = useAppSelector(state => selectSelectedAccounts(state.persists))
    
    useEffect(() => {
        // don't quote if we are submitting
        if (formik.isSubmitting) return
        const abortController = new AbortController()
        const debounceFn = setTimeout(async () => {
            const fromToken = tokenArray.find(token => token.tokenId === formik.values.tokenIn)
            const toToken = tokenArray.find(token => token.tokenId === formik.values.tokenOut)
            // throw if we cannot find decimals
            if (!fromToken?.decimals || !toToken?.decimals) {
                return
            }
            const fromSelectedAccount = selectedAccounts[chainIdToPlatform(tokenInChainId)]
            const toSelectedAccount = selectedAccounts[chainIdToPlatform(tokenOutChainId)]
            if (!fromSelectedAccount || !toSelectedAccount) {
                throw new Error("From or to selected account not found")
            }
            try {
                if (new Decimal(formik.values.amountIn || 0).gt(0) && formik.values.isInput) {
                    // display quoting
                    formik.setFieldValue("quoting", true)
                    const results = await swrMutation.trigger({
                        fromAddress: fromSelectedAccount?.accountAddress ?? "",
                        toAddress: toSelectedAccount?.accountAddress ?? "",
                        amount: Number(formik.values.amountIn),
                        exactIn: true,
                        slippage: formik.values.slippage,
                        fromChainId: tokenInChainId,
                        toChainId: tokenOutChainId,
                        network,
                        fromTokenAddress: fromToken?.address,
                        toTokenAddress: toToken?.address,
                        fromTokenDecimals: fromToken.decimals,
                        toTokenDecimals: toToken.decimals,
                        signal: abortController.signal,
                    })
                    formik.setFieldValue(
                        "aggregations",
                        Object.entries(results).map(([aggregator, quote]) => ({
                            aggregator,
                            amountOut: quote.amountOut,
                        }))
                    )
                    const best = protocolManagerObj.getBestQuote(results)
                    if (best) {
                        formik.setFieldValue("amountOut", best.quote.amountOut)
                        formik.setFieldValue("bestAggregationId", best.aggregator)
                        formik.setFieldValue(
                            "protocols",
                            protocolManagerObj.getProtocols(best.quote)
                        )
                    }
                    formik.setFieldValue("quoting", false)
                }
            } catch (error) {
                console.error(error)
            }
        }, TIMEOUT_QUOTE)
      
        return () => {
            clearTimeout(debounceFn)
            abortController.abort()
        }
    }, [
        formik.values.amountIn,
        formik.values.tokenIn,
        formik.values.tokenOut,
        tokenInChainId,
        tokenOutChainId,
        network,
        formik.values.slippage,
        formik.values.isInput,
        formik.values.refreshKey,
    ])
}