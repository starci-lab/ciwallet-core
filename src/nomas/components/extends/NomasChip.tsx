import React, { type PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"
import type { WithClassName } from "@ciwallet-sdk/types"

export interface NomasChipProps extends WithClassName, PropsWithChildren {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const NomasChip = React.forwardRef<HTMLDivElement, NomasChipProps>(
    ({ 
        className, 
        startIcon, 
        endIcon, 
        ...props 
    }, ref) => {
        return (
            <div
                ref={ref}
                className={twMerge(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-muted/20",
                    className
                )}
                {...props}
            >
                {startIcon}
                <span>{props.children}</span>
                {endIcon}
            </div>
        )
    }
)

NomasChip.displayName = "NomasChip"