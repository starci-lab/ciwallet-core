import React, { useEffect } from "react"
import { Scene, setInitialized, setScene, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasLink, NomasSpacer } from "../../extends"
import { TooltipTitle } from "../../styled"
import { HDWalletSection } from "./HDWalletSection"
import { PlusIcon } from "@phosphor-icons/react"

export const MyWalletsScene = () => {
    const dispatch = useAppDispatch()
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    useEffect(() => {
        if (!initialized) {
            dispatch(setInitialized(true))
        }
    }, [])

    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    const importedWallets = useAppSelector((state) => state.persists.session.importedWallets)
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="My Wallets" showBackButton onBackButtonPress={() => dispatch(setScene(Scene.Main))} />
            <NomasCardBody>
                <NomasCard isInner variant={NomasCardVariant.Dark}>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <TooltipTitle title="HD Wallets" size="sm" />
                            <div className="flex items-center gap-2">   
                                <NomasLink underline={false} className="flex items-center gap-1">
                                    <div className="text-sm text-muted">
                                    Add
                                    </div>            
                                    <PlusIcon />
                                </NomasLink>
                            </div>
                        </div>
                        <NomasSpacer y={6} />
                        {hdWallets.map((hdWallet) => {
                            return (
                                <HDWalletSection key={hdWallet.id} hdWallet={hdWallet} isDefaultExpanded={false} />
                            )
                        })}
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={6} />
                <NomasCard isInner variant={NomasCardVariant.Dark}>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <TooltipTitle title="Imported Wallets" size="sm" />
                            <div className="flex items-center gap-2">   
                                <NomasLink underline={false} className="flex items-center gap-1">
                                    <div className="text-sm text-muted">
                                    Add
                                    </div>            
                                    <PlusIcon />
                                </NomasLink>
                            </div>
                        </div>
                        <NomasSpacer y={6} />
                        <div className="text-sm text-muted">
                            No wallets found
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}