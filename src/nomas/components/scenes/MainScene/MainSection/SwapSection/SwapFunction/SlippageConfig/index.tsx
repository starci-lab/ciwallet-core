import { NomasButtonTextWithIcon } from "@/nomas/components"
import { setSwapFunctionPage, SwapFunctionPage, useAppDispatch } from "@/nomas/redux"
import { SlidersIcon } from "@phosphor-icons/react"
import React from "react"
import { useSwapFormik } from "@/nomas/hooks"

export const SlippageConfig = () => {
    const dispatch = useAppDispatch()
    const formik = useSwapFormik()
    return (
        <NomasButtonTextWithIcon onClick={() => {
            dispatch(setSwapFunctionPage(SwapFunctionPage.SlippageConfig))
        }} icon={<SlidersIcon className="w-5 h-5 min-w-5 min-h-5" />}>
            {formik.values.slippage}%
        </NomasButtonTextWithIcon>   
    )
}
