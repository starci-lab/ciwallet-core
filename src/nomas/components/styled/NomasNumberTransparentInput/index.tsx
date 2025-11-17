import React from "react"
import { sanitizeNumericInput } from "@ciwallet-sdk/utils"
import { twMerge } from "tailwind-merge"
import type { NomasInputProps } from "../../extends"

export const NomasNumberTransparentInput = (props: NomasInputProps) => {
    const onValueChange = (value: string) => {
        const sanitizeInput = sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onValueChange?.(sanitizeInput)
        }
    }

    return (
        <input  
            onChange={
                (event) => onValueChange(event.target.value)
            }
            {...props}
            className={twMerge(props.className, "!bg-transparent text-textpx-0 text-xl text-right focus:outline-none focus:ring-0 border-none")}
        />
    )
}
