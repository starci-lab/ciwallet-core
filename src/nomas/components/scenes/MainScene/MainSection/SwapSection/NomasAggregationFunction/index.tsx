import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasChip, NomasImage } from "@/nomas/components"
import { setSwapFunctionPage, SwapFunctionPage, useAppDispatch } from "@/nomas/redux"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { NomasSpacer } from "@/nomas/components"
import { tokenManagerObj } from "@/nomas/obj"
import { aggregatorManagerObj } from "@/nomas/obj"
import { SmileyXEyesIcon } from "@phosphor-icons/react"

export const NomasAggregationPage = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const aggregations = swapFormik.values.aggregations
    const bestAggregationId = swapFormik.values.bestAggregationId
    const tokenManager = tokenManagerObj
    const tokenOut = tokenManager.getTokenById(swapFormik.values.tokenOut)
    return (
        <>
            <NomasCardHeader
                title="Nomas Aggregation"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
            />
            <NomasCardBody>
                <div className="text-sm text-muted">
                Nomas fetches quotes from multiple aggregators to automatically find the best rate.
                </div>
                <NomasSpacer y={4}/>
                {
                    !aggregations.length ? (
                        <div>
                            <NomasSpacer y={6}/>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <SmileyXEyesIcon className="w-20 h-20 text-text-muted" />
                                <div className="text-sm text-text-muted">
                                No aggregators available
                                </div>
                            </div>
                        </div>
                    ) : (
                        <NomasCard variant={NomasCardVariant.Dark} isInner>
                            <NomasCardBody className="gap-4 flex flex-col p-4">
                                {
                                    aggregations.map((aggregation) => {
                                        const aggregator = aggregatorManagerObj.getAggregatorById(aggregation.aggregator)
                                        return (
                                            <div key={aggregation.aggregator} className="flex items-center justify-between gap-4 py-1">
                                                <div className="flex items-center gap-2">
                                                    <NomasImage 
                                                        className="rounded-full w-8 h-8 min-w-8 min-h-8"
                                                        src={aggregator?.logo ?? ""}
                                                    />
                                                    <div className="text-sm">
                                                        <div>{aggregator?.name}</div>
                                                    </div>
                                                    {
                                                        aggregation.aggregator === bestAggregationId && (
                                                            <NomasChip>
                                                    Best
                                                            </NomasChip>
                                                        )
                                                    }
                                                </div>
                                                <div className="flex items-center gap-2 text-text text-sm">
                                                    <div>{`${aggregation.amountOut} ${tokenOut?.symbol}`}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </NomasCardBody>
                        </NomasCard>
                    )
                }
            </NomasCardBody>
        </> 
    )   
}