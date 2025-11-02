import React from "react"
import { twMerge } from "tailwind-merge"

export interface NomasDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export const NomasDivider = React.forwardRef<HTMLDivElement, NomasDividerProps>(
    ({ orientation = "horizontal", className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="separator"
                className={twMerge(
                    "shrink-0 !bg-border",
                    orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
                    className
                )}
                {...props}
            />
        )
    }
)

NomasDivider.displayName = "NomasDivider"