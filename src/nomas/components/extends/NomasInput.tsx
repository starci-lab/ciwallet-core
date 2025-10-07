import React from "react"
import { cn, Input, type InputProps } from "@heroui/react"

export const NomasInput = (props: InputProps) => {
    const { className, classNames, ...rest } = props
    return <Input 
        {...rest}
        className={cn(className)}
        classNames={{
            input: cn("!text-black !placeholder:text-black/60", classNames?.input),
        }}
    />
}