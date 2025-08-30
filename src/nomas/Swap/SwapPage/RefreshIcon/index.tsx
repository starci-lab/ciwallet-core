import React, { useEffect, useRef } from "react"
import { NomasButton } from "@/nomas/components"
import { setProgress, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { CircularProgress, Tooltip } from "@heroui/react"
import { useSwapFormik } from "@/nomas/hooks"

export const RefreshIcon = () => {
    const dispatch = useAppDispatch()
    const progress = useAppSelector((state) => state.swap.progress)
    const swapFormik = useSwapFormik()
    const refreshKeyRef = useRef(0)

    useEffect(() => {
        refreshKeyRef.current = swapFormik.values.refreshKey
    }, [swapFormik.values.refreshKey])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(setProgress(progress > 100 ? 0 : (progress + 10)))
            if (progress >= 100) {
                swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [progress])

    return (
        <Tooltip content="Auto refresh in 10 seconds, you can click to update manually.">
            <NomasButton size="sm" isIconOnly asBase className="relative overflow-hidden" 
                onPress={() => {
                    dispatch(setProgress(0))
                    swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
                }}
            >
                <CircularProgress
                    classNames={{
                        svg: "w-5 h-5",
                        svgWrapper: "w-5 h-5"
                    }}
                    disableAnimation
                    value={progress}
                />
            </NomasButton>
        </Tooltip>
    )
}