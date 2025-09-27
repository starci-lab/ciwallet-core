import React from "react"
import { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "@heroui/react"
import { cva, type VariantProps } from "class-variance-authority"

const avatarContainerCva = cva("ring-[0.5px] ring-content3-200", {
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
            origin: "w-full h-full",
            shrink: "w-full h-full",
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

export const NomasAvatarGroup = (props: AvatarGroupProps) => {
    return (
        <AvatarGroup {...props} />
    )
}