import React, { useMemo } from "react"
import { DepositFunctionPage, selectSelectedAccountByPlatform, selectTokens, setDepositFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasButton, NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../../../../../extends"
import { NomasImage, NomasSpacer, QRCode, SelectChainTab } from "@/nomas/components"
import { chainManagerObj } from "@/nomas/obj"
import { CopyIcon } from "@phosphor-icons/react"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { toast } from "sonner"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const depositSelectedChainId = useAppSelector((state) => state.stateless.sections.home.depositSelectedChainId)
    const platform = useMemo(() => {
        return chainIdToPlatform(depositSelectedChainId)
    }, [depositSelectedChainId])
    const account = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const chain = chainManagerObj.getChainById(depositSelectedChainId)
    const depositTokenId = useAppSelector((state) => state.stateless.sections.home.depositTokenId)
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const token = useMemo(() => {
        return tokens.find((token) => token.tokenId === depositTokenId)
    }, [tokens, depositTokenId])
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
                            {token ? <div className="relative">
                                <NomasImage src={token.iconUrl} className="w-8 h-8 rounded-full" />
                                <NomasImage src={chain?.iconUrl} className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full" />
                            </div> : <NomasImage src={chain?.iconUrl} alt={chain?.name || "Chain"} className="w-8 h-8 rounded-full" />}
                            <div className="text-sm text-muted">
                                {
                                    token ?`${token.symbol} (${chain?.name})` : chain?.name || "Unknown Network"
                                }
                            </div>
                        </div>
                        <NomasSpacer y={4}/>
                        <QRCode data={account?.accountAddress || ""} />
                        <NomasSpacer y={4}/>
                        <div className="text-smtext-text-muted max-w-[240px] break-all text-center">
                            {account?.accountAddress}
                        </div>
                        <NomasSpacer y={4}/>
                        <NomasButton
                            startIcon={<CopyIcon className="w-5 h-5" />}
                            onClick={() => {
                                navigator.clipboard.writeText(account?.accountAddress || "")
                                toast.success("Address copied to clipboard", {
                                    icon: null,
                                })
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