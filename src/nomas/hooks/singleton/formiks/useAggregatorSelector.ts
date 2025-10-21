import type { FormikProps } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import { aggregatorManagerObj, protocolManagerObj } from "@/nomas/obj"
import { AggregationMode } from "@ciwallet-sdk/classes"
import { useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"
import BN from "bn.js"
import { TIMEOUT_QUOTE } from "@ciwallet-sdk/constants"

export const useAggregatorSelector = (formik: FormikProps<SwapFormikValues>) => {
    const aggregators = aggregatorManagerObj.getAggregators()
    // we try to determine the token in/out to select the best aggregator
    const tokenInChainId = formik.values.tokenInChainId
    const tokenOutChainId = formik.values.tokenOutChainId
    const network = useAppSelector(state => state.persists.session.network)
    // check the token in/out to select the best aggregator based on the chain id
    useEffect(() => {
        console.log(tokenInChainId, tokenOutChainId)
        if (tokenInChainId === tokenOutChainId) {
            const selectedAggregators = aggregators.filter(
                aggregator => {
                    return (
                        aggregator.mode === AggregationMode.SingleChain || aggregator.mode === AggregationMode.Hybrid
                        && aggregator.chains.includes(tokenInChainId)
                        && aggregator.networks.includes(network)
                    )
                }
            )
            formik.setFieldValue("aggregators", selectedAggregators.map(aggregator => aggregator.id))
        }
    }, [tokenInChainId, tokenOutChainId])

    useEffect(() => {
        const abortController = new AbortController()
        const debounceFn = setTimeout(async () => {
            try {
                if (new BN(formik.values.amountIn).gt(new BN(0)) && formik.values.isInput) {
                    // optional: hiển thị trạng thái đang quote
                    formik.setFieldValue("quoting", true)
                    const results = await aggregatorManagerObj.batchQuote({
                        fromAddress: formik.values.tokenIn,
                        toAddress: formik.values.tokenOut,
                        amount: Number(formik.values.amountIn),
                        exactIn: true,
                        slippage: formik.values.slippage,
                        fromChainId: tokenInChainId,
                        toChainId: tokenOutChainId,
                        network,
                        fromToken: formik.values.tokenIn,
                        toToken: formik.values.tokenOut,
                        signal: abortController.signal,
                    })
      
                    console.log(results)
      
                    // mapping dữ liệu quote ra field cần thiết
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
    ])
}