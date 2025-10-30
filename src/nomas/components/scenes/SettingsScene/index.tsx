import React from "react"
import { SettingsPage, useAppSelector } from "@/nomas/redux"
import { SelectNetworkScene } from "./SelectNetworkScene"
import { MainScene } from "./MainScene"
import { RPCScene } from "./RPCScene"
import { ExplorerScene } from "./ExplorerScene"
import { RPCDetailsScene } from "./RPCDetailsScene"

export const SettingsScene = () => {
    const settingsPage = useAppSelector((state) => state.stateless.sections.settings.settingsPage)
    const renderPage = () => {
        switch (settingsPage) {
        case SettingsPage.SelectNetwork:
            return <SelectNetworkScene />
        case SettingsPage.Main:
            return <MainScene />
        case SettingsPage.RPC:
            return <RPCScene />
        case SettingsPage.RPCDetails:
            return <RPCDetailsScene />
        case SettingsPage.Explorer:
            return <ExplorerScene />
        }
    }
    return (
        <>{renderPage()}</>
    )
}