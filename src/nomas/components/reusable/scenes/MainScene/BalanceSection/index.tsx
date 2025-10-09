import { NomasButtonIcon } from "@/nomas/components/extends/NomasButton"
import { NomasCard, NomasCardBody, NomasCardHeader } from "@/nomas/components/extends/NomasCard"
import { Bell, CopySimple, Gear } from "phosphor-react"
import { BalanceContent } from "../BalanceSection/BalanceConent"
import React from "react"
import { NomasDivider } from "@/nomas/components/extends"

export const BalanceSection = () => {
    return (
        <NomasCard className="max-w-md mx-auto">
            <NomasCardHeader className="justify-between items-center py-4">
                <div className="flex flex-row items-center gap-3">
                    <div className="relative">
                        <NomasButtonIcon>
                            <Bell size={18} />
                        </NomasButtonIcon>
                        {/* Notification dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-foreground-700"></div>
                    </div>
                    <p className="text-foreground font-medium">Teddy</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <NomasButtonIcon>
                        <CopySimple size={18} />
                    </NomasButtonIcon>
                    <NomasButtonIcon>
                        <Gear size={18} />
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