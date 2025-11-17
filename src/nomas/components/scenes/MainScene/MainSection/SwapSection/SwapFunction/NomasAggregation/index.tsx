import React from "react"
import { NomasButtonTextWithIcon } from "@/nomas/components"
import { useAppDispatch } from "@/nomas/redux"
import { CaretRightIcon } from "@phosphor-icons/react"
import { SwapFunctionPage, setSwapFunctionPage } from "@/nomas/redux"

export const NomasAggregation = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasButtonTextWithIcon
            onClick={
                () => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.NomasAggregation))
                }
            }
            icon={<CaretRightIcon className="w-5 h-5 min-w-5 min-h-5 text-muted"     /> } 
            useGradient
        >
            Nomas Aggregation
        </NomasButtonTextWithIcon>
    )
}
