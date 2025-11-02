import React from "react"
import { motion } from "framer-motion"
import {
    NomasButton,
    NomasCard,
    NomasCardBody,
    NomasCardFooter,
    NomasCardVariant,
} from "@/nomas/components"
import { setScene, Scene, useAppDispatch } from "@/nomas/redux"
import { assetsConfig } from "@/nomas/resources"

interface SplashStep {
  title: string
  icon: string
}

export const SplashPage = () => {
    const dispatch = useAppDispatch()

    const splashSteps: Array<SplashStep> = [
        { title: "Generating your wallets...", icon: assetsConfig().app.create },
        { title: "Encrypting your wallet...", icon: assetsConfig().app.encrypt },
        {
            title: "All done! Your wallets are ready!",
            icon: assetsConfig().app.done,
        },
    ]

    const renderStep = (step: SplashStep, index: number) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 1,
                duration: 0.6,
                ease: "easeOut",
            }}
            className="flex flex-col items-center gap-2 bg-input p-4 radius-input w-full shadow-card"
        >
            <img src={step.icon} alt={step.title} className="w-10 h-10" />
            <div className="text-sm text-muted">{step.title}</div>
        </motion.div>
    )

    const buttonDelay = splashSteps.length * 1 + 0.5 // ví dụ: 3 steps *1s + 0.5s buffer

    return (
        <NomasCard variant={NomasCardVariant.Gradient}>
            <NomasCardBody className="flex flex-col items-center gap-4">
                {splashSteps.map(renderStep)}
            </NomasCardBody>

            <NomasCardFooter>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: buttonDelay, duration: 0.6, ease: "easeOut" }}
                    className="w-full"
                >
                    <NomasButton
                        className="w-full"
                        onClick={() => {
                            dispatch(setScene(Scene.Main))
                        }}
                    >
            Continue
                    </NomasButton>
                </motion.div>
            </NomasCardFooter>
        </NomasCard>
    )
}
