import React from "react"
import { Button, cn, type ButtonProps } from "@heroui/react"

export interface IconButtonProps extends ButtonProps {
    icon: React.ReactNode
}

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
    return (
        <Button {...props} size="sm" isIconOnly radius="full" className={
            cn(props.className, 
                "shadow-md border-t border-foreground-600 bg-[#323232]")}>
            {icon}
        </Button>
    )
}