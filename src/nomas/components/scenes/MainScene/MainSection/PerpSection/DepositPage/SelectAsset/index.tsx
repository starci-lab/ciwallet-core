import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { chainManagerObj, hyperliquidObj, tokenManagerObj } from "@/nomas/obj"
import { NomasCardBody, NomasCard, NomasImage, NomasCardVariant, TooltipTitle, NomasSpacer, NomasButton, Wallet, Action, NomasNumberTransparentInput } from "@/nomas/components"
import { TokenId, TokenType } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"
import Decimal from "decimal.js"
import { roundNumber } from "@ciwallet-sdk/utils"

export const SelectAsset = () => {
    const dispatch = useAppDispatch()
    const formik = useHyperliquidDepositFormik()
    const depositAssetInfo = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(formik.values.asset), [formik.values.asset])
    const chainMetadata = useMemo(() => chainManagerObj.getChainById(depositAssetInfo.refs[0].chainId), [depositAssetInfo.refs[0].chainId])
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const ref = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(formik.values.asset).refs.find((ref) => ref.chainId === formik.values.chainId), [formik.values.asset, formik.values.chainId])
    
    return (    
        <NomasCard isInner variant={NomasCardVariant.Dark}>
            <NomasCardBody className="p-4">
                <div className="flex items-center justify-between">
                    <TooltipTitle title="Asset" size="xs" className="text"/>
                    <Wallet 
                        isFocused={formik.values.amountFocused}
                        balance={balances[ref?.tokenId ?? TokenId.MonadMainnetMon] ?? 0}
                        onAction={(action: Action) => {
                            const token = tokenManagerObj.getTokenById(ref?.tokenId ?? TokenId.MonadMainnetMon)
                            if (!token) return
                            const isTokenNative = token.type === TokenType.Native
                            const chainMetadata = chainManagerObj.getChainById(token.chainId)
                            const maxBalanceIn = new Decimal(balances[token.tokenId] ?? 0).minus(isTokenNative ? chainMetadata?.minimumGasRequired ?? 0 : 0).toNumber()
                            if (action === Action.Max) {
                                formik.setFieldValue("amount", roundNumber(maxBalanceIn).toString())
                            }
                            if (action === Action.TwentyFivePercent) {
                                formik.setFieldValue("amount", roundNumber(new Decimal(maxBalanceIn).mul(0.25).toNumber()).toString())
                            }
                            if (action === Action.FiftyPercent) {
                                formik.setFieldValue("amount", roundNumber(new Decimal(maxBalanceIn).mul(0.5).toNumber()).toString())
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
                                dispatch(setPerpSectionPage(PerpSectionPage.SelectAssetDeposit))
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
                            value={formik.values.amount.toString()}
                            onValueChange={(value) => {
                                formik.setFieldValue("amount", value)
                            }}
                            onFocus={() => {
                                formik.setFieldValue("amountFocused", true)
                            }}
                            onBlur={() => {
                                formik.setFieldValue("amountFocused", false)
                                formik.setFieldTouched("amount")
                            }}
                            isInvalid={
                                !formik.isValid
                            }
                        />
                    </div>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}