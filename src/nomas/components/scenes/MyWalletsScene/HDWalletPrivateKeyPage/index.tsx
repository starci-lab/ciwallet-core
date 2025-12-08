import { MyWalletsPage, setMyWalletsPage, useAppDispatch } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { ChainCard } from "./ChainCard"
import { useMemo } from "react"

export const HDWalletPrivateKeyPage = () => {
    const dispatch = useAppDispatch()
    const renderedPlatforms = useMemo(() => {
        const platforms = chainManagerObj
            .getPlatformMetadatas()
            .map((platform) => {
                return {
                    platform: platform.platform,
                    name: platform.name,
                    component: 
                    <ChainCard
                        key={platform.platform}
                        platform={platform}
                    />,
                }
            })
        return platforms
    }, [])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader title="Your Private Key" showBackButton onBackButtonPress={() => {
                dispatch(setMyWalletsPage(MyWalletsPage.HDWalletDetails))
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-0">
                    <NomasCardBody className="p-4">
                        {renderedPlatforms.map((platform) => (
                            <div key={platform.platform}>
                                {platform.component}
                            </div>
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}   