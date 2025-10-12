import { NomasButtonTextWithIcon } from "@/nomas/components"
import { SlidersIcon } from "@phosphor-icons/react"
import React from "react"

export const SlippageConfig = () => {
    return (
        <NomasButtonTextWithIcon icon={<SlidersIcon />}>
        0.1%
        </NomasButtonTextWithIcon>   
    )
}
