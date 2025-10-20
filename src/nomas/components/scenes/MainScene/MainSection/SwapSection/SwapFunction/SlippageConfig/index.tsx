import { NomasButtonTextWithIcon } from "@/nomas/components"
import { SlidersIcon } from "@phosphor-icons/react"
import React from "react"

export const SlippageConfig = () => {
    return (
        <NomasButtonTextWithIcon icon={<SlidersIcon className="w-5 h-5 min-w-5 min-h-5" />}>
        0.1%
        </NomasButtonTextWithIcon>   
    )
}
