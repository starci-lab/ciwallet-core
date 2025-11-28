import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasChip, NomasImage } from "@/nomas/components"
import { setSwapPage, SwapPage, useAppDispatch } from "@/nomas/redux"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { NomasSpacer } from "@/nomas/components"
import { tokenManagerObj } from "@/nomas/obj"
import { aggregatorManagerObj } from "@/nomas/obj"

export const NomasAggregationPage = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const aggregations = swapFormik.values.aggregations
    const bestAggregationId = swapFormik.values.bestAggregationId
    const tokenManager = tokenManagerObj
    const tokenOut = tokenManager.getTokenById(swapFormik.values.tokenOut)
    const aggregatorManager = aggregatorManagerObj
    return (
        <>
            <NomasCardHeader
                title="Nomas Aggregation"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapPage(SwapPage.Swap))
                }}
            />
            <NomasCardBody>
                <div className="text-sm text-foreground-500">
        Nomas fetches quotes from multiple aggregators and automatically selects the best rate.
                </div>
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark}>
                    <NomasCardBody className="p-4">
                        {
                            aggregations.map((aggregation) => {
                                const aggregator = aggregatorManager.getAggregatorById(aggregation.aggregator)
                                return (
                                    <div key={aggregator?.id} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <NomasImage src={aggregator?.logo ?? ""} />
                                            <div className="text-sm">{aggregator?.name}</div>

                                            {aggregation.aggregator === bestAggregationId && (
                                                <NomasChip>
                                        Best
                                                </NomasChip>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-foreground-500 text-sm">
                                            <div>{`${aggregation.amountOut} ${tokenOut?.symbol}`}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </> 
    )   
}