import React from "react"
import { NomasCard, NomasCardVariant, NomasSpacer } from "@/nomas/components"
import { HomeSelectorTab as HomeSelectorTabEnum, useAppSelector } from "@/nomas/redux"
import { PortfolioFunction } from "./PortfolioFunction"
import { HomeSelectorTab } from "./HomeSelectorTab"
import { DepositFunction } from "./DepositFunction"
import { WithdrawFunction } from "./WithdrawFunction"

export const HomeSection = () => {
    const homeSection = useAppSelector((state) => state.stateless.sections.home.homeSelectorTab)
    const renderPage = () => {
        switch (homeSection) {
        case HomeSelectorTabEnum.Portfolio: {
            return <PortfolioFunction />
        }
        case HomeSelectorTabEnum.Deposit: {
            return <DepositFunction />
        }
        case HomeSelectorTabEnum.Withdraw: {
            return <WithdrawFunction />
        }
        }
    }
    return (  
        <>
            <HomeSelectorTab />
            <NomasSpacer y={2} />
            <NomasCard variant={NomasCardVariant.Gradient} isContainer>{renderPage()}</NomasCard>
        </>
    )
}