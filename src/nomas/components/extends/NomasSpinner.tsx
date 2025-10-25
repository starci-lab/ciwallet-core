import { CircleNotchIcon } from "@phosphor-icons/react"
import type { WithClassName } from "@ciwallet-sdk/types"
import { twMerge } from "tailwind-merge"

export const NomasSpinner = ({ className }: WithClassName) => {
    return (
        <CircleNotchIcon
            role="status"
            aria-label="Loading"
            className={twMerge("size-4 animate-spin", className)}
        />
    )
}

