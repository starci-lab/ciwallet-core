"use client"

import React, { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { NomasButton, NomasTooltip } from "@/nomas/components"

export const RefreshProgressRing = () => {
    const swapFormik = useSwapFormik()
    const controls = useAnimation()
    const refreshKeyRef = useRef(0)
    const radius = 8.75
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        refreshKeyRef.current = swapFormik.values.refreshKey
    }, [swapFormik.values.refreshKey])

    useEffect(() => {
        let isCancelled = false

        const loop = async () => {
            while (!isCancelled) {
                await controls.start({
                    strokeDashoffset: circumference,
                    transition: { duration: 0 },
                })
                await controls.start({
                    strokeDashoffset: 0,
                    transition: { duration: 10, ease: "linear" },
                })

                swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
            }
        }

        loop()
        return () => {
            isCancelled = true
        }
    }, [controls, circumference])
    return (
        <NomasTooltip content="Auto refresh in 10 seconds, you can click to update manually.">
            <NomasButton className="relative overflow-hidden w-10 h-10" 
                onClick={() => {
                    swapFormik.setFieldValue("refreshKey", refreshKeyRef.current + 1)
                }}
            >
                <motion.svg
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
                        animate={controls}
                        className="text-primary"
                    />
                </motion.svg>
            </NomasButton>
        </NomasTooltip>
    )
}