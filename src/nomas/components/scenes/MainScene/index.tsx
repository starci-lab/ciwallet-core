import React, { useEffect } from "react"
import { MenuSection } from "./MenuSection"
import { BalanceSection } from "./BalanceSection"
import { MainSection } from "./MainSection"
import { setInitialized, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasSpacer } from "@/nomas/components"

export const MainScene = () => {
    const dispatch = useAppDispatch()
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    useEffect(() => {
        if (!initialized) {
            dispatch(setInitialized(true))
        }
    }, [])

    return (
        <>
            <BalanceSection />
            <NomasSpacer y={2} />
            <MenuSection />
            <NomasSpacer y={2} />
            <MainSection />
        </>
    )
}