import React from "react"
import { NomasButton, NomasCard, NomasCardBody, NomasCardVariant, NomasLink, NomasSpacer } from "../../../extends"
import { CloudArrowUpIcon, DownloadSimpleIcon } from "@phosphor-icons/react"
import { InitPage, setInitPage, useAppDispatch } from "@/nomas/redux"
import { assetsConfig } from "@/nomas/resources"

export const LaunchPage = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
            isContainer
        >
            <NomasCardBody className="flex flex-col items-center">
                <NomasSpacer y={12} />
                <div className="w-24 h-24 rounded-full border border-button shadow-button">
                    <img src={assetsConfig().app.logo} alt="Nomas Wallet" className="w-24 h-24" />
                </div>
                <NomasSpacer y={4} />
                <div className="text-center">
                    <div className="text-4xl font-extrabold tracking-tight text-muted">Nomas Wallet</div>
                    <div className="mt-2 text-sm text-muted">Simple - Seamless - Synergy</div>
                </div>
                <NomasSpacer y={4} />
                <NomasButton
                    className="w-full justify-between gap-4"
                    endIcon={
                        <img src={assetsConfig().app.rocket} alt="Rocket" className="w-10 h-10" />
                    }
                    xlSize
                    onClick={async () => {
                        dispatch(setInitPage(InitPage.CreatePassword))
                    }}
                >
                    Rocket Launch
                </NomasButton>
                <NomasSpacer y={4} />
                <div className="w-full text-start flex px-6 justify-between">
                    <div className="flex items-center gap-1 text-xs">
                        <NomasLink>I already have a wallet</NomasLink>
                        <DownloadSimpleIcon className="w-4 h-4 text-muted" />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <NomasLink>Backup from cloud</NomasLink>
                        <CloudArrowUpIcon className="w-4 h-4 text-muted" />
                    </div>
                </div>
                <NomasSpacer y={12} />
            </NomasCardBody>
        </NomasCard>
    )
}
