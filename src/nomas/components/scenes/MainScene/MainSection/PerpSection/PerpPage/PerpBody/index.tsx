import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, PerpChart } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"

export const PerpBody = () => {
    const candleSnapshots = useAppSelector((state) => state.stateless.sections.perp.candleSnapshots)
    return <div>
        <NomasCard variant={NomasCardVariant.Dark} isInner>
            <NomasCardBody className="p-4">
                <PerpChart candleSnapshots={candleSnapshots} />
            </NomasCardBody>
        </NomasCard>
    </div>
}