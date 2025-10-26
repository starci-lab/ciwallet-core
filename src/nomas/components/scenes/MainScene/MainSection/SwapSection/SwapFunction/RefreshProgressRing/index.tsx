"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { NomasButtonIcon, NomasTooltip } from "@/nomas/components"

export const RefreshProgressRing = () => {
    const swapFormik = useSwapFormik()
    const radius = 8.75
    const circumference = 2 * Math.PI * radius
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const animationKeyRef = useRef(0) // used to restart ring animation

    useEffect(() => {
        const triggerRefresh = () => {
            swapFormik.setFieldValue("refreshKey", swapFormik.values.refreshKey + 1)
            animationKeyRef.current += 1 // restart animation
        }
        // loop every 10s   
        intervalRef.current = setInterval(triggerRefresh, 10_000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [swapFormik.values.refreshKey])

    return (
        <NomasTooltip content="Auto refresh every 10 s (click to refresh manually).">
            <NomasButtonIcon
                className="relative overflow-hidden w-10 h-10 radius-button"
                onClick={
                    () => {
                        swapFormik.setFieldValue("refreshKey", swapFormik.values.refreshKey + 1)
                        animationKeyRef.current += 1
                    }
                }
            >
                <motion.svg
                    key={animationKeyRef.current} // restart animation each time
                    className="absolute inset-0 m-auto size-5"
                    viewBox="0 0 20 20"
                >
                    <circle
                        cx="10"
                        cy="10"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        className="text-muted-foreground/20 opacity-30"
                    />
                    <motion.circle
                        cx="10"
                        cy="10"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="text-primary"
                    />
                </motion.svg>
            </NomasButtonIcon>
        </NomasTooltip>
    )
}