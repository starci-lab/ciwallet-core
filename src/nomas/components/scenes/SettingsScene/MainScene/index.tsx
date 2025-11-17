import React, { useCallback, useMemo } from "react"
import { Scene, SettingsPage, setSettingsPage, setScene, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasSpacer } from "../../../extends"
import { PressableMotion, TooltipTitle } from "../../../styled"
import { Network } from "@ciwallet-sdk/types"
import { CaretRightIcon } from "@phosphor-icons/react"
import { chainManagerObj } from "@/nomas/obj"

export const MainScene = () => {
    const dispatch = useAppDispatch()
    const network = useAppSelector((state) => state.persists.session.network)
    const renderNetwork = useCallback(() => {
        switch (network) {
        case Network.Mainnet:
            return "Mainnet"
        case Network.Testnet:
            return "Testnet"
        }
    }, [network])
    const chainLength = useMemo(() => {
        return chainManagerObj.toObject().length
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="w-full">
            <NomasCardHeader title="Settings" showBackButton onBackButtonPress={() => dispatch(setScene(Scene.Main))} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0">
                        <PressableMotion onClick={() => {
                            dispatch(setSettingsPage(SettingsPage.SelectNetwork))
                        }} className="flex items-center justify-between">
                            <TooltipTitle title="Network" size="sm" />
                            <div className="flex items-center gap-2">
                                <div className="text-sm">
                                    {renderNetwork()}
                                </div>
                                <CaretRightIcon className="w-4 h-4 text-text-muted" />
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={6} />
                        <PressableMotion onClick={() => {
                            dispatch(setSettingsPage(SettingsPage.RPC))
                        }} className="flex items-center justify-between">
                            <TooltipTitle title="RPC" size="sm" />
                            <div className="flex items-center gap-2">
                                <div className="text-sm">
                                    {chainLength} chains
                                </div>
                                <CaretRightIcon className="w-4 h-4 text-text-muted" />
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={6} />
                        <PressableMotion onClick={() => {
                            dispatch(setSettingsPage(SettingsPage.Explorer))
                        }} className="flex items-center justify-between">
                            <TooltipTitle title="Explorer" size="sm" />
                            <div className="flex items-center gap-2">
                                <div className="text-sm">
                                    {chainLength} chains
                                </div>
                                <CaretRightIcon className="w-4 h-4 text-text-muted" />
                            </div>
                        </PressableMotion>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={6} />
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0">
                        <PressableMotion onClick={() => {
                            dispatch(setSettingsPage(SettingsPage.Main))
                        }} className="flex items-center justify-between">
                            <TooltipTitle title="Language" size="sm" />
                            <div className="flex items-center gap-2">
                                <div className="text-sm">
                            English
                                </div>
                                <CaretRightIcon className="w-4 h-4 text-text-muted" />
                            </div>
                        </PressableMotion>
                        <NomasSpacer y={6} />
                        <PressableMotion onClick={() => {
                            dispatch(setSettingsPage(SettingsPage.Main))
                        }} className="flex items-center justify-between">
                            <TooltipTitle title="Currency" size="sm" />
                            <div className="flex items-center gap-2">
                                <div className="text-sm">
                            USD
                                </div>
                                <CaretRightIcon className="w-4 h-4 text-text-muted" />
                            </div>
                        </PressableMotion>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}