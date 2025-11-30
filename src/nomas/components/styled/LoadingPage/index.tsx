import React from "react"
import { NomasCardBody, NomasSpacer, NomasSpinner } from "../../extends"
import { NomasCard } from "../../extends"
import { NomasCardVariant } from "../../extends"

export const LoadingPage = () => {
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="h-[300px]">
            <NomasCardBody className="grid place-items-center h-full">
                <div className="flex flex-col items-center">
                    <NomasSpinner className="size-20 text-text-muted"/>
                    <NomasSpacer y={4} />
                    <div className="text-text-muted">Loading...</div>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}