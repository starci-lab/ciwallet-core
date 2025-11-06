import React, { useCallback } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { PressableMotion } from "../../../styled"
import { Network } from "@ciwallet-sdk/types"
import { setSettingsPage, useAppDispatch, SettingsPage, useAppSelector, setNetwork } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"
import { CheckIcon } from "@phosphor-icons/react"

export const SelectNetworkScene = () => {
    const dispatch = useAppDispatch()
    const currentNetwork = useAppSelector((state) => state.persists.session.network)
    const isSelected = useCallback((network: Network) => {
        return currentNetwork === network
    }, [currentNetwork])
    const renderNetworkName = useCallback((network: Network) => {
        switch (network) {
        case Network.Mainnet:
            return "Mainnet"
        case Network.Testnet:
            return "Testnet"
        }
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="w-full">
            <NomasCardHeader title="Select Network" showBackButton onBackButtonPress={() => {
                dispatch(setSettingsPage(SettingsPage.Main))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0 flex flex-col gap-2">
                        {
                            Object.values(Network).map((network) => {
                                return (
                                    <PressableMotion key={network} onClick={() => {
                                        dispatch(setNetwork(network))
                                        dispatch(setSettingsPage(SettingsPage.Main))
                                    }} className="flex items-center justify-between w-full">
                                        {
                                            <div
                                                className={
                                                    twMerge("p-4 flex items-center gap-2 justify-between rounded-button w-full", 
                                                        isSelected(network) ? "bg-button-dark border-border-card shadow-button" : "bg-card-foreground transition-colors !shadow-none")
                                                }
                                            >
                                                <div className="p-0 flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2 justify-between w-full">
                                                        <div className="text-sm text-text">{renderNetworkName(network)}</div>  
                                                        {isSelected(network) && <CheckIcon className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            </div>                                         
                                        }
                                    </PressableMotion>
                                )
                            })
                        }
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}