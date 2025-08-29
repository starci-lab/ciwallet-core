import React from "react"
import { Tooltip, cn } from "@heroui/react"
import { InfoIcon } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"

export interface TooltipTitleProps {
    title: string
    tooltip?: string
    size: "xs" | "sm"
}

const titleCva = cva("text-sm font-medium text-foreground-500", {
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
        <div className={cn(titleCva({ size }), "flex items-center gap-1")}>
            {title}
            {tooltip && (
                <Tooltip content={tooltip}>
                    <InfoIcon className={infoCva({ size })}/>
                </Tooltip>
            )}
        </div>
    )
}