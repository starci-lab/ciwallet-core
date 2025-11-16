import React, { useMemo, type PropsWithChildren } from "react"

export interface NomasWarningTextProps extends PropsWithChildren {
    color?: "danger" | "warning" | "info" | "success" | "muted"
}
export const NomasWarningText = ({ children, color = "danger" }: NomasWarningTextProps) => {
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
        <div className={`text-xs ${colorClass}`}>{children}</div>
    )
}
