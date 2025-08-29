import React, { useEffect } from "react"
import { NomasButton } from "@/nomas/components"
import { setProgress, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { CircularProgress, Tooltip } from "@heroui/react"

export const RefreshIcon = () => {
    const dispatch = useAppDispatch()
    const progress = useAppSelector((state) => state.swap.progress)

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(setProgress(progress > 100 ? 0 : progress + 10))
        }, 1000)
        return () => clearInterval(interval)
    }, [progress])

    return (
        <Tooltip content="Auto refresh in 10 seconds, you can click to update manually.">
            <NomasButton size="sm" isIconOnly asBase className="relative overflow-hidden">
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