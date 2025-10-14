import React from "react"
import { DepositFunctionPage, selectSelectedAccountByChainId, setDepositFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasButton, NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../../../../extends"
import { NomasImage, NomasSpacer, QRCode, SelectChainTab } from "@/nomas/components"
import { chainManagerObj } from "@/nomas/obj"
import { CopyIcon } from "@phosphor-icons/react"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const depositSelectedChainId = useAppSelector((state) => state.stateless.sections.home.depositSelectedChainId)
    const account = useAppSelector((state) => selectSelectedAccountByChainId(state.persists, depositSelectedChainId))
    const chain = chainManagerObj.getChainById(depositSelectedChainId)
    if (!account) throw new Error("Account not found")
    return (
        <>
            <NomasCardHeader
                title="Deposit"
            />
            <NomasCardBody>
                <SelectChainTab
                    isSelected={(chainId) => depositSelectedChainId === chainId}
                    onClick={() => {
                        dispatch(setDepositFunctionPage(DepositFunctionPage.ChooseNetwork))
                    }}
                />
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner >
                    <NomasCardBody className="grid place-items-center p-6">
                        <div className="flex items-center gap-2">
                            <NomasImage src={chain?.iconUrl} alt={chain?.name || "Chain"} className="w-8 h-8 rounded-full" />
                            <div className="text-sm text-muted">
                                {chain?.name || "Unknown Network"}
                            </div>
                        </div>
                        <NomasSpacer y={4}/>
                        <QRCode data={account?.accountAddress || ""} />
                        <NomasSpacer y={4}/>
                        <div className="text-sm text-muted max-w-[240px] break-all text-center">
                            {account?.accountAddress}
                        </div>
                        <NomasSpacer y={4}/>
                        <NomasButton
                            startIcon={<CopyIcon className="w-5 h-5" />}
                            onClick={() => {
                                navigator.clipboard.writeText(account?.accountAddress || "")
                            }}
                        >
                            Copy Address
                        </NomasButton>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )

}