import React from "react"
import { twMerge } from "tailwind-merge"

/**
 * A styled Link component compatible with Shadcn UI.
 */
export interface NomasLinkProps extends React.HTMLAttributes<HTMLDivElement> {
    onPress?: () => void
    underline?: boolean
}
export const NomasLink = React.forwardRef<HTMLDivElement, NomasLinkProps>(
    ({ className, children, onPress, underline = true, ...props }, ref) => {
        return (
            <div
                onClick={onPress ? () => onPress() : undefined}
                ref={ref}
                className={
                    twMerge(
                        underline ? "underline" : "underline-none",
                        "text-muted-hover cursor-pointer",
                        className
                    )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

NomasLink.displayName = "NomasLink"