import React from "react"
import { PerpHeader } from "./PerpHeader"
import { NomasCardBody, NomasSpacer, NomasTab } from "@/nomas/components"
import { PerpTab, setPerpTab, useAppSelector } from "@/nomas/redux"
import { PerpBody } from "./PerpBody"
import { useAppDispatch } from "@/nomas/redux"
import { PerpAssets } from "./PerpAssets"
import { PerpTrade } from "./PerpTrade"

export const PerpPage = () => {
    const perpTab = useAppSelector((state) => state.stateless.sections.perp.tab)
    const dispatch = useAppDispatch()
    
    const tabs = [
        {
            value: PerpTab.Trade,
            label: "Trade",
            content: <PerpTrade />,
        },
        {
            value: PerpTab.Assets,
            label: "Assets",
            content: <PerpAssets />,
        },
        {
            value: PerpTab.History,
            label: "History",
            content: <div>History</div>,
        },
    ]
    return (
        <NomasCardBody>
            <PerpHeader />
            <NomasSpacer y={6}/>    
            <PerpBody />
            <NomasSpacer y={6}/> 
            <NomasTab 
                value={perpTab} 
                onValueChange={(value) => dispatch(setPerpTab(value as PerpTab))} 
                tabs={tabs.map((tab) => ({
                    value: tab.value,
                    label: tab.label,
                }))} 
            />
            <NomasSpacer y={6}/> 
            {tabs.find((tab) => tab.value === perpTab)?.content}
        </NomasCardBody>
    )
}