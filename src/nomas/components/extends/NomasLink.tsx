import React from "react"
import { Link, type LinkProps } from "@heroui/react"

export interface NomasLinkProps extends LinkProps {
    asButton?: boolean
}
export const NomasLink = ({ children, asButton, ...props }: NomasLinkProps) => {
    return (
        asButton ? (
            <Link as="button" {...props}>
                {children}
            </Link>
        ) : (
            <Link {...props}>
                {children}
            </Link>
        )
    )
}