import React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { twMerge } from "tailwind-merge"

function Avatar({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={twMerge(
                "relative flex size-8 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />
    )
}

function AvatarImage({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={twMerge("aspect-square size-full", className)}
            {...props}
        />
    )
}

function AvatarFallback({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={twMerge(
                "bg-muted flex size-full items-center justify-center rounded-full",
                className
            )}
            {...props}
        />
    )
}

export { Avatar, AvatarImage, AvatarFallback }
