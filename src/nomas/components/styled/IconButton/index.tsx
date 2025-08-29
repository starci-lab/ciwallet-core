import React from "react"
import { cn, type ButtonProps } from "@heroui/react"
import { NomasButton } from "../../extends"

export interface IconButtonProps extends ButtonProps {
    icon: React.ReactNode
}

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
    return (
        <NomasButton {...props} size="sm" asBase isIconOnly radius="full" className={
            cn(props.className)}>
            {icon}
        </NomasButton>
    )
}