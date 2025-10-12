import React from "react"
import { InfoIcon } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { NomasTooltip } from "../../extends"

export interface TooltipTitleProps {
    title: string
    tooltip?: string
    size: "xs" | "sm"
}

const titleCva = cva("text-muted text-sm font-medium", {
    variants: {
        size: {
            xs: "text-xs",
            sm: "text-sm",
        },
    },
    defaultVariants: {
        size: "sm",
    },
})

const infoCva = cva("text-foreground-500", {
    variants: {
        size: {
            xs: "w-4 h-4",
            sm: "h-5 h-5",
        },
    },
    defaultVariants: {
        size: "sm",
    },
})

export const TooltipTitle = ({ title, tooltip, size }: TooltipTitleProps) => {
    return (
        <div className={twMerge(titleCva({ size }), "flex items-center gap-1")}>
            {title}
            {tooltip && (
                <NomasTooltip content={tooltip}>
                    <InfoIcon className={infoCva({ size })}/>
                </NomasTooltip>
            )}
        </div>
    )
}