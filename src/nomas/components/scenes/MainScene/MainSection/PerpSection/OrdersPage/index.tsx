import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
} from "@/nomas/components"
import {
    PerpSectionPage,
    setPerpSectionPage,
    useAppDispatch,
} from "@/nomas/redux"

export const OrdersPage = () => {
    const dispatch = useAppDispatch()
    return (
        <>
            <NomasCardHeader
                title={"Orders"}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}