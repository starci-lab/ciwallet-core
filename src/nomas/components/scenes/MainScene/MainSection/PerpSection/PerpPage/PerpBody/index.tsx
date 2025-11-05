import { PerpChart } from "./PerpChart"
import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant } from "@/nomas/components"

export const PerpBody = () => {
    return <div>
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4">
                <PerpChart />
            </NomasCardBody>
        </NomasCard>
    </div>
}