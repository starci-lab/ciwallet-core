import React from "react"
import { twMerge } from "tailwind-merge"

export interface NomasSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg"
}

/**
 * A simple Tailwind-based loading spinner.
 * Works seamlessly inside buttons, cards, etc.
 */
export const NomasSpinner = React.forwardRef<HTMLDivElement, NomasSpinnerProps>(
    ({ size = "sm", className, ...props }, ref) => {
        const sizeClasses = {
            xs: "w-3 h-3 border-2",
            sm: "w-4 h-4 border-2",
            md: "w-5 h-5 border-2",
            lg: "w-6 h-6 border-[3px]",
        }[size]

        return (
            <div
                ref={ref}
                className={twMerge(
                    "inline-block animate-spin rounded-full border-muted-foreground/30 border-t-foreground",
                    sizeClasses,
                    className
                )}
                {...props}
            />
        )
    }
)

NomasSpinner.displayName = "NomasSpinner"