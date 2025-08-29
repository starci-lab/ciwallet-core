import React from "react"
import { NomasImage, NomasTooltip } from "../../extends"
import type { WithClassName } from "@ciwallet-sdk/types"
import { cn } from "@heroui/react"

export interface PythIconProps extends WithClassName {
    tooltip?: string
}

export const PythIcon = ({ tooltip, className }: PythIconProps) => {
    return (
        <NomasTooltip content={tooltip || "Market price feed from Pyth Network"}>
            <NomasImage 
                removeWrapper 
                radius="full" 
                src="/icons/mixin/pyth.svg" 
                alt="Pyth" 
                className={cn(className)}
            />
        </NomasTooltip>
    )
}