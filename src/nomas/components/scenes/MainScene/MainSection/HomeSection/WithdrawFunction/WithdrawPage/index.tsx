import { DepositFunctionPage, HomeSelectorTab, WithdrawFunctionPage, selectTokenByIdNullable, setDepositFunctionPage, setDepositSelectedChainId, setDepositTokenId, setHomeSelectorTab, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { Action, NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasInput, NomasLink, NomasNumberTransparentInput, NomasSpacer, SelectChainTabVariant   } from "@/nomas/components"
import { SelectChainTab, TooltipTitle, Wallet } from "@/nomas/components"
import { useEffect } from "react"
import { useTransferFormik } from "@/nomas/hooks"
import { roundNumber } from "@ciwallet-sdk/utils"
import { SelectToken } from "./SelectToken"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import { ChainId, TokenId, TokenType } from "@ciwallet-sdk/types"
import Decimal from "decimal.js"
import { twMerge } from "tailwind-merge"


export const WithdrawPageComponent = () => {
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const formik = useTransferFormik()
    const token = useAppSelector((state) => selectTokenByIdNullable(state.persists, formik.values.tokenId))
    // we need to set the from address and encrypted private key
    useEffect(() => {
        formik.setFieldValue("tokenAddress", token?.address)
    }, [token])
    // we need to set the balance
    useEffect(() => {
        if (!formik.values.tokenId) return
        formik.setFieldValue("balance", balances[formik.values.tokenId] ?? 0)
    }, [balances, formik.values.tokenId])
    const dispatch = useAppDispatch()
    const gasToken = useAppSelector((state) => selectTokenByIdNullable(state.persists, formik.values.gasTokenId))
    return (
        <>
            <NomasCardHeader
                title="Withdraw"
            />
            <NomasCardBody>
                <div className="bg-card-dark p-4 rounded-card-inner border border-border-card">
                    <TooltipTitle title="From" size="sm" className="text" />
                    <NomasSpacer y={2}/>
                    <SelectChainTab 
                        variant={SelectChainTabVariant.Dark2}
                        isSelected={(chainId) => chainId === formik.values.chainId}
                        onClick={() => {
                            dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.ChooseNetwork))
                        }}
                        withAllNetworks={true}
                    />
                    <NomasSpacer y={4}/>
                    <div>
                        <div className="flex justify-between items-center">
                            <TooltipTitle title="Assets" size="sm" className="text"/>
                            {token && (
                                <Wallet
                                    isFocused={formik.values.amountFocused}
                                    balance={balances[token.tokenId] ?? 0}
                                    onAction={
                                        (action: Action) => {
                                            const token = tokenManagerObj.getTokenById(formik.values.tokenId)
                                            if (!token) return
                                            const isTokenNative = token.type === TokenType.Native
                                            const chainMetadata = chainManagerObj.getChainById(token.chainId)
                                            const maxBalanceIn = new Decimal(balances[token.tokenId ?? TokenId.MonadTestnetMon] ?? 0).minus(isTokenNative ? chainMetadata?.minimumGasRequired ?? 0 : 0).toNumber()
                                            if (action === Action.Max) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(maxBalanceIn).toString()
                                                )
                                            }
                                            if (action === Action.TwentyFivePercent) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(
                                                        new Decimal(maxBalanceIn).mul(0.25).toNumber(),
                                                        5
                                                    ).toString()
                                                )
                                            }
                                            if (action === Action.FiftyPercent) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(
                                                        new Decimal(maxBalanceIn).mul(0.5).toNumber(),
                                                        5
                                                    ).toString()
                                                )
                                            }
                                        }}
                                />
                            )}
                        </div>
                        <NomasSpacer y={4}/>
                        <div className="flex justify-between items-center bg-card-dark-2 p-2 pr-4 rounded-card-inner">
                            <SelectToken
                                token={token}
                                chainMetadata={token ? chainManagerObj.getChainById(token.chainId) : undefined}
                                onSelect={() => {
                                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.SelectToken))
                                }}
                            />
                            <div>
                                <NomasNumberTransparentInput
                                    className={twMerge(formik.errors.amount && formik.touched.amount && "!text-danger")}
                                    value={formik.values.amount.toString()}
                                    onValueChange={(value) => {
                                        formik.setFieldValue("amount", value)
                                    }}
                                    onFocus={() => {
                                        formik.setFieldValue("amountFocused", true)
                                    }}
                                    isRequired
                                    onBlur={() => {
                                        formik.setFieldValue("amountFocused", false)
                                        formik.setFieldTouched("amount")
                                    }}
                
                                    isInvalid={
                                        !!(
                                            formik.touched.amount &&
                          formik.errors.amount
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>   
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <TooltipTitle title="Recipient" size="sm" className="text"/>
                        <NomasSpacer y={2}/>
                        <NomasInput
                            placeholder="Select token"
                            value={formik.values.toAddress}
                            errorMessage={formik.errors.toAddress}
                            onValueChange={(value) => {
                                formik.setFieldValue("toAddress", value)
                            }}
                            onBlur={() => {
                                formik.setFieldTouched("toAddress")
                            }}
                            isInvalid={!!(formik.errors.toAddress && formik.touched.toAddress)}
                        />
                    </NomasCardBody> 
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <div className="w-full">
                    <NomasButton className="w-full"
                        isDisabled={!formik.isValid}
                        isLoading={formik.isSubmitting}
                        xlSize
                        onClick={() => {
                            formik.submitForm()
                        }}>
                        {(() => {
                            if (new Decimal(formik.values.amount).gt(new Decimal(balances[formik.values.tokenId ?? TokenId.MonadTestnetMon] ?? 0))) {
                                return `Insufficient ${tokenManagerObj.getTokenById(formik.values.tokenId)?.symbol ?? ""} Balance`
                            }
                            if (formik.isSubmitting) {
                                return "Sending"
                            }
                            if (formik.values.isEnoughGasBalance) {
                                return "Send"
                            }
                            return "Insufficient gas balance"
                        })()}
                    </NomasButton>
                    {
                        !formik.values.isEnoughGasBalance && gasToken && (() => {
                            const chainMetadata = chainManagerObj.getChainById(gasToken?.chainId ?? ChainId.Monad)
                            return (
                                <>
                                    <NomasSpacer y={4}/>
                                    <div className="flex items-center gap-1">
                                        <div className="text-muted text-xs">You need to have at least {chainMetadata?.minimumGasRequired} {gasToken?.symbol} to cover the gas fee.</div>
                                        <NomasLink 
                                            onPress={() => {
                                                dispatch(setHomeSelectorTab(HomeSelectorTab.Deposit))
                                                dispatch(setDepositSelectedChainId(gasToken?.chainId ?? ChainId.Monad))
                                                dispatch(setDepositTokenId(formik.values.gasTokenId))
                                                dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                                            }}
                                            className="text-xs text-primary"
                                        >
                                    Deposit
                                        </NomasLink>
                                    </div>    
                                </>
                            )
                        })()}
                </div>
            </NomasCardFooter>
        </>
    )
}