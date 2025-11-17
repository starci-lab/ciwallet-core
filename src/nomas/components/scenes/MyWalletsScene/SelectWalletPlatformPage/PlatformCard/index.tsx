import React from "react"
import type { PlatformMetadata } from "@ciwallet-sdk/types"
import { PressableMotion, TokenIcons } from "../../../../styled"
import { NomasSpacer } from "../../../../extends"
import { MyWalletsPage, setMyWalletsPage, setSelectedPlatform, setSelectedPrivateKeyPlatform, useAppDispatch } from "@/nomas/redux"
import { chainManagerObj } from "@/nomas/obj"
import { useInputPrivateKeyFormik } from "@/nomas/hooks"

export interface PlatformCardProps {
    platform: PlatformMetadata
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
    const dispatch = useAppDispatch()
    const formik = useInputPrivateKeyFormik()
    return (
        <PressableMotion onClick={() => {
            dispatch(setSelectedPlatform(platform.platform))
            dispatch(setSelectedPrivateKeyPlatform(platform.platform))
            dispatch(setMyWalletsPage(MyWalletsPage.InputPrivateKey))
            formik.setFieldValue("platform", platform.platform)
        }}>
            <div className="w-full justify-start block h-full p-4">
                <div className="p-0 flex items-center gap-2 justify-between w-full">
                    <div className="text-sm">{platform.name}</div>
                    <NomasSpacer y={2} />
                    <TokenIcons platform={platform.platform} />
                </div>
                <NomasSpacer y={4} />
                <div className="text-xs text-muted">
                    {chainManagerObj.getPlatformDescriptions(platform.platform)}
                </div>
            </div>
        </PressableMotion>
    )
}