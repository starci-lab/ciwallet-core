import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { MyWalletsPage, setMyWalletsPage, useAppDispatch } from "@/nomas/redux"
import { chainManagerObj } from "@/nomas/obj"
import { PlatformCard } from "./PlatformCard"
import { Platform } from "@ciwallet-sdk/types"

export const SelectWalletPlatformPage = () => {
    const dispatch = useAppDispatch()
    const platforms = useMemo(() => {
        return chainManagerObj.getPlatformMetadatas()
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Select Platform" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
            }} />
            <NomasCardBody className="gap-2 flex flex-col">
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-0 flex flex-col gap-2" scrollable scrollHeight={300}>
                        {
                            platforms.map((platform) => (
                                <PlatformCard key={platform.platform} platform={platform} />
                            ))
                        }      
                    </NomasCardBody>    
                </NomasCard>      
            </NomasCardBody>
        </NomasCard>
    )
}