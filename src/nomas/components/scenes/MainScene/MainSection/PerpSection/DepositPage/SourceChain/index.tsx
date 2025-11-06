import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React from "react"
import { chainManagerObj } from "@/nomas/obj"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage, PressableMotion } from "@/nomas/components"
import { CaretRightIcon } from "@phosphor-icons/react"

export const SourceChain = () => {
    const dispatch = useAppDispatch()
    const depositSourceChainId = useAppSelector((state) => state.stateless.sections.perp.depositSourceChainId)
    const depositSourceChainInfo = chainManagerObj.getChainById(depositSourceChainId)
    return (
        <PressableMotion onClick={() => {
            dispatch(setPerpSectionPage(PerpSectionPage.SourceChain))
        }}>
            <NomasCard isInner variant={NomasCardVariant.Dark}>
                <NomasCardBody className="p-4 items-center justify-between flex w-full">
                    <div className="flex items-center gap-2">
                        <NomasImage src={depositSourceChainInfo?.iconUrl} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="text-sm text-text">{depositSourceChainInfo?.name}</div>
                        </div>
                    </div>
                    <CaretRightIcon className="text-text-muted size-4" />
                </NomasCardBody>
            </NomasCard>
        </PressableMotion>
    )
}