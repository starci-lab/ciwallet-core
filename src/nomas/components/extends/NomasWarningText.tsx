import React, { useMemo, type PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

export interface NomasWarningTextProps extends PropsWithChildren {
    color?: "danger" | "warning" | "info" | "success" | "muted"
    className?: string
}
export const NomasWarningText = ({ children, color = "danger", className }: NomasWarningTextProps) => {
    const colorClass = useMemo(() => {
        switch (color) {
        case "danger":
            return "text-danger"
        case "warning":
            return "text-warning"
        case "info":
            return "text-info"
        case "success":
            return "text-success"
        case "muted":
            return "text-muted"
        default:
            return "text-danger"
        }
    }, [color])
    return (
        <div className={twMerge(`text-xs ${colorClass}`, className)}>{children}</div>
    )
}
