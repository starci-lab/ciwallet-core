import React from "react"
import { MenuSection } from "./MenuSection"
import { BalanceSection } from "./BalanceSection"
import { MainSection } from "./MainSection"

export const MainScene = () => {
    return (
        <>
            <BalanceSection />
            <MenuSection />
            <MainSection />
        </>
    )
}