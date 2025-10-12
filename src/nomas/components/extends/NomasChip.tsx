import React from "react"
import { XIcon } from "@phosphor-icons/react"
import { Badge } from "../shadcn"
import { twMerge } from "tailwind-merge"

export interface NomasChipProps extends React.ComponentProps<typeof Badge> {
  size?: "sm" | "md" | "lg"
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

export const NomasChip = React.forwardRef<HTMLDivElement, NomasChipProps>(
    ({ 
        className, 
        size = "md", 
        startIcon, 
        endIcon, 
        removable, 
        onRemove, 
        children, 
        ...props 
    }, ref) => {
        return (
            <Badge
                ref={ref}
                className={twMerge(
                    "inline-flex items-center gap-1 rounded-full",
                    size === "sm" && "text-xs px-2 py-0.5",
                    size === "md" && "text-sm px-3 py-1",
                    size === "lg" && "text px-4 py-1.5",
                    className
                )}
                {...props}
            >
                {startIcon && <span className="shrink-0 text-muted-foreground">{startIcon}</span>}
                <span className="truncate">{children}</span>
                {endIcon && <span className="shrink-0 text-muted-foreground">{endIcon}</span>}
                {removable && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-muted-foreground/10"
                    >
                        <XIcon className="w-3 h-3 text-muted-foreground" />
                    </button>
                )}
            </Badge>
        )
    }
)

NomasChip.displayName = "NomasChip"