import React, { useEffect, useRef } from "react"
import { NomasButtonIcon, NomasTooltip } from "@/nomas/components"
import { useAppDispatch } from "@/nomas/redux"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { ArrowClockwiseIcon } from "@phosphor-icons/react"

export const RefreshIcon = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const refreshKeyRef = useRef(0)

    useEffect(() => {
        refreshKeyRef.current = swapFormik.values.refreshKey
    }, [swapFormik.values.refreshKey])

    useEffect(() => {
        const interval = setInterval(() => {
            swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <NomasTooltip content="Auto refresh in 10 seconds, you can click to update manually.">
            <NomasButtonIcon
                className="radius-button h-10 w-10"
                onClick={() => {
                    swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
                }}
            >
                <ArrowClockwiseIcon className="w-5 h-5 min-w-5 min-h-5"/>
            </NomasButtonIcon>
        </NomasTooltip>
    )
}