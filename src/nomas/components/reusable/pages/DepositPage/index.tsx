import React from "react"
import { MainMenu } from "../../scenes/MainScene/MenuSection"
import { BalanceSection } from "./BalanceSection"
import { DepositSection } from "./DepositSection"

export const DepositPage = () => {
    return (
        <>
            <BalanceSection />
            <MainMenu />
            <DepositSection />
        </>
    )
}