import React from "react"
import { Divider, type DividerProps } from "@heroui/react"

export const NomasDivider  = (props: DividerProps) => {
    return (
        <Divider orientation="vertical" className="bg-foreground-600" {...props} />
    )
}