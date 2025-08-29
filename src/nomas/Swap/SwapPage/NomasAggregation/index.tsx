import { NomasButtonTextWithIcon } from "@/nomas/components"
import { CaretRightIcon } from "@phosphor-icons/react"
import React from "react"

export const NomasAggregation = () => {
    return (
        <NomasButtonTextWithIcon icon={<CaretRightIcon />} useGradient>
            Nomas Aggregation
        </NomasButtonTextWithIcon>
    )
}
