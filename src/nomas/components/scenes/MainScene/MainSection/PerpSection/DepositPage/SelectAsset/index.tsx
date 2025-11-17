import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { chainManagerObj, hyperliquidObj } from "@/nomas/obj"
import { NomasCardBody, NomasCard, NomasImage, NomasCardVariant, TooltipTitle, NomasSpacer, NomasButton, Wallet, Action, NomasNumberTransparentInput } from "@/nomas/components"
import { TokenId } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"

export const SelectAsset = () => {
    const dispatch = useAppDispatch()
    const hyperliquidDepositFormik = useHyperliquidDepositFormik()
    const depositAssetInfo = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(hyperliquidDepositFormik.values.asset), [hyperliquidDepositFormik.values.asset])
    const chainMetadata = useMemo(() => chainManagerObj.getChainById(depositAssetInfo.refs[0].chainId), [depositAssetInfo.refs[0].chainId])
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const ref = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(hyperliquidDepositFormik.values.asset).refs.find((ref) => ref.chainId === hyperliquidDepositFormik.values.chainId), [hyperliquidDepositFormik.values.asset, hyperliquidDepositFormik.values.chainId])
    return (    
        <NomasCard isInner variant={NomasCardVariant.Dark}>
            <NomasCardBody className="p-4">
                <div className="flex items-center justify-between">
                    <TooltipTitle title="Asset" size="xs" className="text"/>
                    <Wallet 
                        balance={balances[ref?.tokenId ?? TokenId.MonadMainnetMon] ?? 0}
                        onAction={(action: Action) => {
                            if (action === Action.Max) {
                                dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
                            }
                            if (action === Action.TwentyFivePercent) {
                                dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
                            }
                            if (action === Action.FiftyPercent) {
                                dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
                            }
                        }}
                    />
                </div>  
                <NomasSpacer y={4} />
                <div className="bg-card-dark-2 p-2 rounded-card-inner">
                    <div className="flex items-center justify-between">
                        <NomasButton
                            className="h-12"
                            onClick={() => {
                                dispatch(setPerpSectionPage(PerpSectionPage.SelectAsset))
                            }}
                        >
                            <div className="flex items-center gap-2 h-12">
                                <div className="relative">
                                    <NomasImage src={depositAssetInfo.iconUrl} className="w-8 h-8 rounded-full" />
                                    <NomasImage src={chainMetadata?.iconUrl} className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-sm text-text">{depositAssetInfo.name}</div>
                                    <div className="text-text-muted text-xs text-left">{depositAssetInfo.symbol}</div>
                                </div>
                            </div>
                        </NomasButton>
                        <NomasNumberTransparentInput
                            value={hyperliquidDepositFormik.values.amount.toString()}
                            onValueChange={(value) => {
                                hyperliquidDepositFormik.setFieldValue("amount", value)
                            }}
                            onFocus={() => {
                                hyperliquidDepositFormik.setFieldValue("amountFocused", true)
                            }}
                            onBlur={() => {
                                hyperliquidDepositFormik.setFieldValue("amountFocused", false)
                                hyperliquidDepositFormik.setFieldTouched("amount")
                            }}
                            isInvalid={
                                !!(
                                    hyperliquidDepositFormik.touched.amount &&
                                hyperliquidDepositFormik.errors.amount
                                )
                            }
                        />
                    </div>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}