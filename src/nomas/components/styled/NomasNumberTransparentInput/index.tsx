import React from "react"
import { Input, type InputProps, cn } from "@heroui/react"
import { sanitizeNumericInput } from "@ciwallet-sdk/utils"

export const NomasNumberTransparentInput = (props: InputProps) => {
    const onValueChange = (value: string) => {
        const sanitizeInput = sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onValueChange?.(sanitizeInput)
        }
    }

    return (
        <Input  
            disableAnimation
            classNames={{
                inputWrapper: cn(
                    "!bg-transparent px-0", 
                    "data-[hover=true]:!bg-transparent",
                    "group-data-[focus=true]:!bg-transparent",
                    "group-data-[focus-visible=true]:!ring-none",
                    props.classNames?.inputWrapper
                ),
                innerWrapper: cn(
                    "!bg-transparent px-0 ",
                    props.classNames?.innerWrapper
                ),
                mainWrapper: cn(
                    "!bg-transparent px-0 hover:!bg-transparent",
                    props.classNames?.mainWrapper
                ),
                input: cn(
                    "!bg-transparent px-0 text-xl text-right",
                    props.classNames?.input
                ),
            }}
            {...props}
            onValueChange={onValueChange}
        />
    )
}