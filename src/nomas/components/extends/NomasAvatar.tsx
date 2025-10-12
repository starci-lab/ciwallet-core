import React from "react"
import { twMerge } from "tailwind-merge"
import { Avatar, AvatarImage } from "../shadcn"

// Root
export const NomasAvatar = React.forwardRef<
  React.ComponentRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ className, ...props }, ref) => (
    <Avatar
        ref={ref}
        className={
            twMerge(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
        {...props}
    />
))
NomasAvatar.displayName = "NomasAvatar"

export const NomasAvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarImage>,
  React.ComponentPropsWithoutRef<typeof AvatarImage>
>(({ className, ...props }, ref) => (
    <AvatarImage ref={ref} className={twMerge("aspect-square size-full", className)} {...props} />
))
NomasAvatarImage.displayName = "NomasAvatarImage"