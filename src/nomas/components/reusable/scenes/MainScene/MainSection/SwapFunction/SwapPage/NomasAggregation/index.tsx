import React from "react"
import { NomasButtonTextWithIcon } from "@/nomas/components"
import { setSwapPage, SwapPageState, useAppDispatch } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"

export const NomasAggregation = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasButtonTextWithIcon 
            onPress={
                () => {
                    dispatch(setSwapPage(SwapPageState.NomasAggregation))
                }
            }
            icon={<CaretRightIcon /> } useGradient>
            Nomas Aggregation
        </NomasButtonTextWithIcon>
    )
}
