import React from "react"
import { NomasCard, NomasCardVariant } from "@/nomas/components"
import { HomeFunction, useAppSelector } from "@/nomas/redux"
import { PortfolioFunction } from "./PortfolioFunction"
import { TokenFunction } from "./TokenFunction"
import { SendFunction } from "./SendFunction"
import { ReceiveFunction } from "./ReceiveFunction"

export const HomeSection = () => {
    const homeSection = useAppSelector((state) => state.stateless.sections.home.function)
    const renderPage = () => {
        switch (homeSection) {
        case HomeFunction.Portfolio:
            return <PortfolioFunction />
        case HomeFunction.Token:
            return <TokenFunction />
        case HomeFunction.Send:
            return <SendFunction />
        case HomeFunction.Receive:
            return <ReceiveFunction />
        }
    }
    return <NomasCard variant={NomasCardVariant.Gradient}>{renderPage()}</NomasCard>
}