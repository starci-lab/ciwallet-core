import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "@/nomas/components"
import { MyWalletsPage, selectHdWalletById, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { Platform } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"
import { NomasButton, NomasCardFooter } from "../../../extends"

interface RenderedPlatform {
    platform: Platform
    name: string
    component: React.ReactNode
}

export const HDWalletDetailsSection = () => {
    const hdWalletId = useAppSelector((state) => state.stateless.sections.myWallets.hdWalletId)
    const hdWallet = useAppSelector((state) => selectHdWalletById(state.persists, hdWalletId))
    const dispatch = useAppDispatch()
    const renderedPlatforms = useMemo(() => {
        const platforms: Array<RenderedPlatform> = chainManagerObj
            .getPlatformMetadatas()
            .map((platform) => {
                return {
                    platform: platform.platform,
                    name: platform.name,
                    component: <ChainCard
                        key={platform.platform}
                        platform={platform}
                    />,
                }
            })
        return platforms
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader 
                title={hdWallet?.name} 
                showBackButton 
                onBackButtonPress={() => {
                    dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
                }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-0">
                        {renderedPlatforms.map((platform) => platform.component)}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton xlSize className="w-full">
                    Manage Wallet
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}