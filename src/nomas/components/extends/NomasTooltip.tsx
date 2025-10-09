import React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { twMerge } from "tailwind-merge"

export interface NomasTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  delayDuration?: number
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

/**
 * NomasTooltip — Shadcn style tooltip using Radix primitives.
 */
export const NomasTooltip = ({
    content,
    children,
    delayDuration = 200,
    side = "top",
    className,
}: NomasTooltipProps) => {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        className={twMerge(
                            "z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-50 zoom-in-95",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                            "data-[side=bottom]:slide-in-from-top-2",
                            "data-[side=top]:slide-in-from-bottom-2",
                            "data-[side=left]:slide-in-from-right-2",
                            "data-[side=right]:slide-in-from-left-2",
                            className
                        )}
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="fill-popover" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    )
}