import { motion } from "framer-motion"
import type { WithClassName } from "@ciwallet-sdk/types"
import type { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

export interface PressableMotionProps extends PropsWithChildren, WithClassName {
    onClick?: () => void
}
export const PressableMotion = ({ children, className, onClick }: PressableMotionProps) => {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            className={twMerge("cursor-pointer", className)}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}