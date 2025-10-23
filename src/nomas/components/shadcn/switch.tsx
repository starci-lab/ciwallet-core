"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { twMerge } from "tailwind-merge"

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={twMerge(
                "peer data-[state=checked]:bg-switch-background-active data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 border border-card ",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={twMerge(
                    "bg-switch-thumb pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-10px)] data-[state=unchecked]:translate-x-0"
                )}
            />
        </SwitchPrimitive.Root>
    )
}

export { Switch }
