import { SmileyXEyesIcon } from "@phosphor-icons/react"
import type { WithClassName } from "@ciwallet-sdk/types"
import React from "react"
import { twMerge } from "tailwind-merge"

interface NotFoundProps extends WithClassName{
    title: string
}

export const NotFound = ({ title, className }: NotFoundProps) => {
    return (
        <div className={
            twMerge(
                "h-full grid place-items-center", 
                className)
        }>
            <div className="flex flex-col items-center justify-center gap-2">
                <SmileyXEyesIcon className="size-20 text-text-muted" />
                <div className="text-sm text-text-muted">
                    {title}
                </div>
            </div>
        </div>
    )
}