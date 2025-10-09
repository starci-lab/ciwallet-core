import React from "react"
import { NomasButton, type NomasButtonProps } from "../../extends"
import { twMerge } from "tailwind-merge"

export interface IconButtonProps extends NomasButtonProps {
    icon: React.ReactNode
}

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
    return (
        <NomasButton {...props} className={
            twMerge(props.className)}>
            {icon}
        </NomasButton>
    )
}