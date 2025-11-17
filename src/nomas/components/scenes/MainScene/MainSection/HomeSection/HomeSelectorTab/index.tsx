import React from "react"
import { HomeSelectorTab as HomeSelectorTabEnum, setHomeSelectorTab, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasSpacer } from "../../../../../extends"
import { ArrowLineDownIcon, ArrowLineUpIcon, BankIcon, CardholderIcon, ImageIcon, ListNumbersIcon } from "@phosphor-icons/react"
import { twMerge } from "tailwind-merge"

export const HomeSelectorTab = () => {
    const homeSelectorTab = useAppSelector((state) => state.stateless.sections.home.homeSelectorTab)
    const dispatch = useAppDispatch()
    const tabs = [
        {
            value: HomeSelectorTabEnum.Portfolio,
            label: "Portfolio",
            icon: <CardholderIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.Portfolio ? "fill" : "regular"
            } />
        },
        {
            value: HomeSelectorTabEnum.Deposit, label: "Deposit", icon: <ArrowLineUpIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.Deposit ? "fill" : "regular"
            } />
        },
        {
            value: HomeSelectorTabEnum.Withdraw, label: "Withdraw", icon: <ArrowLineDownIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.Withdraw ? "fill" : "regular"
            } />
        },
        {
            value: HomeSelectorTabEnum.NFTs, label: "NFTs", icon: <ImageIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.NFTs ? "fill" : "regular"
            } />
        },
        {
            value: HomeSelectorTabEnum.Transactions, label: "Transactions", icon: <ListNumbersIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.Transactions ? "fill" : "regular"
            } />
        },
        {
            value: HomeSelectorTabEnum.FiatGateway, label: "Fiat Gateway", icon: <BankIcon className="w-6 h-6" weight={
                homeSelectorTab === HomeSelectorTabEnum.FiatGateway ? "fill" : "regular"
            } />
        },
    ]
    return (
        <NomasCard variant={NomasCardVariant.Gradient2}>
            <NomasCardBody>
                <div className="relative grid grid-cols-3 text-center mb-2">
                    {tabs.slice(0, 3).map((tab) => (
                        <button key={tab.value} className={
                            twMerge("flex flex-col items-center justify-center gap-1 text-xs text-text-muted-dark cursor-pointer",
                                homeSelectorTab === tab.value && "text-muted"
                            )
                        } onClick={() => dispatch(setHomeSelectorTab(tab.value))}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                    <div className="absolute top-0 left-1/3 w-px h-full bg-border"></div>
                    <div className="absolute top-0 left-2/3 w-px h-full bg-border"></div>
                </div>
                <NomasSpacer y={2} />
                <div className="relative grid grid-cols-3 text-center">
                    {tabs.slice(3, 6).map((tab) => (
                        <button key={tab.value} className={
                            twMerge(
                                "flex flex-col items-center justify-center gap-1 text-xs text-text-muted-dark cursor-pointer",
                                homeSelectorTab === tab.value && "text-muted"
                            )
                        } onClick={() => dispatch(setHomeSelectorTab(tab.value))}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                    <div className="absolute top-0 left-1/3 w-px h-full bg-border"></div>
                    <div className="absolute top-0 left-2/3 w-px h-full bg-border"></div>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}