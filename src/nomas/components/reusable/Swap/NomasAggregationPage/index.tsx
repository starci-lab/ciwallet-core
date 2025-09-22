import React from "react"
import { NomasAvatar, NomasCard, NomasCardBody, NomasCardHeader, NomasChip } from "@/nomas/components"
import { setSwapPage, SwapPageState, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { Spacer } from "@heroui/react"

export const NomasAggregationPage = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const aggregations = swapFormik.values.aggregations
    const bestAggregationId = swapFormik.values.bestAggregationId
    const tokenManager = useAppSelector((state) => state.token.manager)
    const tokenOut = tokenManager.getTokenById(swapFormik.values.tokenOut)
    const aggregatorManager = useAppSelector((state) => state.aggregator.manager)
    return (
        <>
            <NomasCardHeader
                title="Nomas Aggregation"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapPage(SwapPageState.Swap))
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
                            } key={aggregator?.id} className="bg-content3 w-full">
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