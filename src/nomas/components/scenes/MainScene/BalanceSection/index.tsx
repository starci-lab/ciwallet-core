import React from "react"
import { 
    NomasCard, 
    NomasCardBody, 
    NomasCardHeader, 
    NomasButtonIcon, 
    NomasDivider,
    NomasCardVariant
} from "../../../extends"
import { Bell, CopySimple, Gear } from "phosphor-react"
import { BalanceContent } from "../BalanceSection/BalanceConent"
import { Scene, setScene, useAppDispatch } from "@/nomas/redux"

export const BalanceSection = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Gradient}>
            <NomasCardHeader>
                <div className="flex flex-row items-center gap-3">
                    <div className="relative">
                        <NomasButtonIcon>
                            <Bell className="w-5 h-5" />
                        </NomasButtonIcon>
                        {/* Notification dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-foreground-700"></div>
                    </div>
                    <div className="text text-sm">Teddy</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <NomasButtonIcon onClick={() => dispatch(setScene(Scene.MyWallets))}>
                        <CopySimple />
                    </NomasButtonIcon>
                    <NomasButtonIcon onClick={() => dispatch(setScene(Scene.Settings))}>
                        <Gear />
                    </NomasButtonIcon>
                </div>
            </NomasCardHeader>
            <NomasDivider orientation="horizontal" className="w-4/5 mx-auto bg-foreground-600" />
            <NomasCardBody className="p-0">
                <BalanceContent />
            </NomasCardBody>
        </NomasCard>
    )
}