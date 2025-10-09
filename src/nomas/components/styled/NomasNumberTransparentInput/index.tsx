import React from "react"
import { Input } from "../../shadcn"
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
        <Input  
            className={twMerge("!bg-transparent px-0 text-xl text-right", props.className)}
            {...props}
            onChange={
                (event) => onValueChange(event.target.value)
            }
        />
    )
}
