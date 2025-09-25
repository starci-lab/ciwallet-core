import React from "react"
import { MainMenu } from "../../MainMenu"
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