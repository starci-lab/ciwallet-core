import React from "react"
import { Avatar, type AvatarProps } from "@heroui/react"
import { cva, type VariantProps } from "class-variance-authority"

const avatarContainerCva = cva("ring-[0.5px]", {
    variants: {
        dimension: {
            origin: "w-8 h-8",
            shrink: "w-4 h-4",
        },
    },
    defaultVariants: {
        dimension: "origin",
    },
})

const avatarImageCva = cva("", {
    variants: {
        dimension: {
            origin: "w-5 h-5",
            shrink: "w-[10px] h-[10px]",
        },
    },
    defaultVariants: {
        dimension: "origin",
    },
})

export interface NomasAvatarProps extends AvatarProps, VariantProps<typeof avatarContainerCva> {}

export const NomasAvatar = ({ dimension, ...props }: NomasAvatarProps & AvatarProps) => {
    return (
        <Avatar
            {...props}
            classNames={{ base: avatarContainerCva({ dimension }) }}
            imgProps={{ className: avatarImageCva({ dimension }) }}
        />
    )
}