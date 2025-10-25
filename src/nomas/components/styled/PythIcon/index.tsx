import React from "react"
import { NomasImage, NomasTooltip } from "../../extends"
import type { WithClassName } from "@ciwallet-sdk/types"
import { twMerge } from "tailwind-merge"
import { assetsConfig } from "@/nomas/resources"

export interface PythIconProps extends WithClassName {
    tooltip?: string
}

export const PythIcon = ({ tooltip, className }: PythIconProps) => {
    return (
        <NomasTooltip content={tooltip || "Market price feed from Pyth Network"}>
            <NomasImage 
                radius="full" 
                src={assetsConfig().mixin.pyth.iconUrl}
                alt="Pyth" 
                className={twMerge(className)}
            />
        </NomasTooltip>
    )
}