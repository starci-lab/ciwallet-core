import React from "react"
import { cn, Image, type ImageProps } from "@heroui/react"

export const NomasImage = (props: ImageProps) => {
    return <Image radius="none" {...props} className={cn(props.className, "w-8 h-8")} />
}
