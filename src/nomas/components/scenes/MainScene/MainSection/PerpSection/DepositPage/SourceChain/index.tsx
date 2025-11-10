import { PerpSectionPage, setPerpSectionPage, useAppDispatch } from "@/nomas/redux"
import React, { useMemo } from "react"
import { chainManagerObj } from "@/nomas/obj"
import { NomasButton, NomasImage } from "@/nomas/components"
import { CaretRightIcon } from "@phosphor-icons/react"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"

export const SourceChain = () => {
    const dispatch = useAppDispatch()
    const hyperliquidDepositFormik = useHyperliquidDepositFormik()
    const depositSourceChainInfo = useMemo(() => chainManagerObj.getChainById(hyperliquidDepositFormik.values.chainId), [hyperliquidDepositFormik.values.chainId])
    return (
        <NomasButton onClick={() => {
            dispatch(setPerpSectionPage(PerpSectionPage.SourceChain))
        }}>      
            <div className="flex items-center gap-2">
                <NomasImage src={depositSourceChainInfo?.iconUrl ?? ""} className="w-10 h-10 rounded-full" />
                <div>
                    <div className="text-sm text-text">{depositSourceChainInfo?.name ?? ""}</div>
                </div>
            </div>
            <CaretRightIcon className="text-text-muted size-4" />
        </NomasButton>
    )
}