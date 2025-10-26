import type { FormikProps } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import { protocolManagerObj } from "@/nomas/obj"
import { useAppSelector } from "@/nomas/redux"
import { useEffect } from "react"
import { TIMEOUT_QUOTE } from "@ciwallet-sdk/constants"
import Decimal from "decimal.js"
import { useBatchAggregatorSwrMutation } from "../mixin"

export const useAggregatorSelector = (formik: FormikProps<SwapFormikValues>) => {
    // we try to determine the token in/out to select the best aggregator
    const tokenInChainId = formik.values.tokenInChainId
    const tokenOutChainId = formik.values.tokenOutChainId
    const network = useAppSelector(state => state.persists.session.network)
    const swrMutation = useBatchAggregatorSwrMutation()
    useEffect(() => {
        const abortController = new AbortController()
        const debounceFn = setTimeout(async () => {
            try {
                if (new Decimal(formik.values.amountIn).gt(0) && formik.values.isInput) {
                    // optional: hiển thị trạng thái đang quote
                    formik.setFieldValue("quoting", true)
                    const results = await swrMutation.trigger({
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
        formik.values.refreshKey,
    ])
}