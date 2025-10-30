import React, { useMemo } from "react"
import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"
import { MyWalletsPage, Scene, setMyWalletsPage, setScene, setSelectedPlatform, useAppDispatch } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"

interface RenderedPlatform {
    platform: Platform
    name: string
    component: React.ReactNode
}
export const AccountsPage = () => {
    const renderedPlatforms = useMemo(() => {
        const platforms: Array<RenderedPlatform> = chainManagerObj.getPlatformMetadatas().map((platform) => {
            return {
                platform: platform.platform,
                name: platform.name,
                component: <ChainCard
                    isPressable={true}
                    onPress={() => {
                        dispatch(setSelectedPlatform(platform.platform))
                        dispatch(setMyWalletsPage(MyWalletsPage.SelectAccount))
                    }}
                    key={platform.platform}
                    platform={platform}
                    isSelected={false}
                />,
            }
        })
        return platforms
    }, [])
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} 
            isContainer
            className="w-full">
            <NomasCardHeader title="My Wallets" showBackButton onBackButtonPress={() => {
                dispatch(setScene(Scene.Main))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-0 flex flex-col gap-2">
                        {renderedPlatforms.map((platform) => platform.component)}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton
                    xlSize
                    className="w-full"
                    onClick={() => {
                        dispatch(setMyWalletsPage(MyWalletsPage.Management))
                    }}
                >
                    Manage
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}