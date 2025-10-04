import React from "react"
import { NomasAvatar, NomasCard, NomasCardBody, NomasCardHeader, NomasChip } from "@/nomas/components"
import { setSwapPage, SwapPage, useAppDispatch } from "@/nomas/redux"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { Spacer } from "@heroui/react"
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
                Nomas fetches quotes from multiple aggregators to automatically find the best rate.
                </div>
                <Spacer y={4}/>
                {
                    aggregations.map((aggregation) => {
                        const aggregator = aggregatorManager.getAggregatorById(aggregation.aggregator)
                        return (
                            <NomasCard asCore={
                                aggregation.aggregator === bestAggregationId
                            } key={aggregator?.id} className="bg-default w-full">
                                <NomasCardBody className="flex-row justify-between">
                                    <div className="flex items-center gap-2">
                                        <NomasAvatar 
                                            src={aggregator?.logo}
                                        />
                                        <div className="text-sm">
                                            <div>{aggregator?.name}</div>
                                        </div>
                                        {
                                            aggregation.aggregator === bestAggregationId && (
                                                <NomasChip color="primary">
                                                    Best
                                                </NomasChip>
                                            )
                                        }
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground-500 text-sm">
                                        <div>{`${aggregation.amountOut} ${tokenOut?.symbol}`}</div>
                                    </div>
                                </NomasCardBody>
                            </NomasCard>
                        )
                    })
                }
            </NomasCardBody>
        </> 
    )   
}