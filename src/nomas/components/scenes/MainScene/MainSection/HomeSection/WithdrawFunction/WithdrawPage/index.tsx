import { DepositFunctionPage, HomeSelectorTab, WithdrawFunctionPage, selectTokenByIdNullable, setDepositFunctionPage, setDepositSelectedChainId, setDepositTokenId, setHomeSelectorTab, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { Action, NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasInput, NomasLink, NomasNumberTransparentInput, NomasSpacer, SelectChainTabVariant } from "@/nomas/components"
import { SelectChainTab, TooltipTitle, Wallet } from "@/nomas/components"
import { useEffect } from "react"
import { useTransferFormik } from "@/nomas/hooks"
import { roundNumber } from "@ciwallet-sdk/utils"
import { SelectToken } from "./SelectToken"
import { chainManagerObj } from "@/nomas/obj"
import { ChainId } from "@ciwallet-sdk/types"


export const WithdrawPageComponent = () => {
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const formik = useTransferFormik()
    const token = useAppSelector((state) => selectTokenByIdNullable(state.persists, formik.values.tokenId))
    const maxBalanceIn = formik.values.balance - 0.01
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
                <div className="bg-card-dark p-4 rounded-card-inner">
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
                                            if (action === Action.Max) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(balances[token.tokenId] ?? 0).toString()
                                                )
                                            }
                                            if (action === Action.TwentyFivePercent) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(
                                                        Math.min(
                                                            (balances[token.tokenId] ?? 0) * 0.25,
                                                            maxBalanceIn
                                                        ),
                                                        5
                                                    ).toString()
                                                )
                                            }
                                            if (action === Action.FiftyPercent) {
                                                formik.setFieldValue(
                                                    "amount",
                                                    roundNumber(
                                                        Math.min(
                                                            (balances[token.tokenId] ?? 0) * 0.5,
                                                            maxBalanceIn
                                                        ),
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
                        {!formik.values.isEnoughGasBalance && gasToken ? "Insufficient gas balance" : "Send"}
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