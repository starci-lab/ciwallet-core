import React from "react"
import { twMerge } from "tailwind-merge"

/**
 * A styled Link component compatible with Shadcn UI.
 */
export interface NomasLinkProps extends React.HTMLAttributes<HTMLDivElement> {
    onPress?: () => void
}
export const NomasLink = React.forwardRef<HTMLDivElement, NomasLinkProps>(
    ({ className, children, onPress, ...props }, ref) => {
        return (
            <div
                onClick={onPress ? () => onPress() : undefined}
                ref={ref}
                className={
                    twMerge(
                        "underline text-muted-hover cursor-pointer",
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