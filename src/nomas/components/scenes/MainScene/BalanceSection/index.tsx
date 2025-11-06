import React from "react"
import { 
    NomasCard, 
    NomasCardBody, 
    NomasCardHeader, 
    NomasButtonIcon,
    NomasCardVariant
} from "../../../extends"
import { BalanceContent } from "../BalanceSection/BalanceConent"
import { Scene, setScene, useAppDispatch } from "@/nomas/redux"
import { CardholderIcon, CopyIcon, GearIcon } from "@phosphor-icons/react"

export const BalanceSection = () => {
    const dispatch = useAppDispatch()
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardHeader addDivider hideLeftBlankSpace>
                <div className="flex flex-row items-center gap-2 justify-between w-full">
                    <div className="flex items-center gap-2">
                        <NomasButtonIcon roundedFull onClick={() => dispatch(setScene(Scene.MyWallets))}>
                            <CardholderIcon className="min-w-5 min-h-5 text-text-muted w-5 h-5" />
                        </NomasButtonIcon>
                        <NomasButtonIcon roundedFull onClick={() => dispatch(setScene(Scene.CopyAddress))}>
                            <CopyIcon className="min-w-5 min-h-5 text-text-muted w-5 h-5" />
                        </NomasButtonIcon>
                    </div>
                    <div className="flex items-center gap-2">
                        <NomasButtonIcon roundedFull onClick={() => dispatch(setScene(Scene.Settings))}>
                            <GearIcon className="min-w-5 min-h-5 text-text-muted w-5 h-5" />
                        </NomasButtonIcon>
                    </div>
                </div>
            </NomasCardHeader>
            <NomasCardBody className="p-0">
                <BalanceContent />
            </NomasCardBody>
        </NomasCard>
    )
}