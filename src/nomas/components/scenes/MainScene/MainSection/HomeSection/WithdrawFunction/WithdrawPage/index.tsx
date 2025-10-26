import { WithdrawFunctionPage, selectTokenById, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { Action, NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasInput, NomasNumberTransparentInput, NomasSpacer, SelectChainTabVariant } from "@/nomas/components"
import { SelectChainTab, TooltipTitle, Wallet } from "@/nomas/components"
import { useEffect } from "react"
import { useTransferFormik } from "@/nomas/hooks"
import { roundNumber } from "@ciwallet-sdk/utils"
import { SelectToken } from "./SelectToken"
import { chainManagerObj } from "@/nomas/obj"


export const WithdrawPage = () => {
    const selectedTokenId = useAppSelector((state) => state.stateless.sections.home.selectedTokenId)
    const token = useAppSelector((state) => selectTokenById(state.persists, selectedTokenId))
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const formik = useTransferFormik()
    const maxBalanceIn = formik.values.balance - 0.01
    // we need to set the from address and encrypted private key
    useEffect(() => {
        formik.setFieldValue("tokenAddress", token?.address)
    }, [token])
    // we need to set the balance
    useEffect(() => {
        formik.setFieldValue("balance", balances[formik.values.tokenId] ?? 0)
    }, [balances, formik.values.tokenId])
    const dispatch = useAppDispatch()
    // we need to set the token id
    return (
        <>
            <NomasCardHeader
                title="Withdrawal"
            />
            <NomasCardBody>
                <div className="bg-card-dark p-4 radius-card-inner">
                    <TooltipTitle title="From" size="sm" className="text" />
                    <NomasSpacer y={2}/>
                    <SelectChainTab 
                        variant={SelectChainTabVariant.Dark2}
                        isSelected={(chainId) => chainId === formik.values.chainId}
                        onClick={() => {
                            dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.ChooseNetwork))
                        }}
                    />
                    <NomasSpacer y={4}/>
                    <div>
                        <div className="flex justify-between items-center">
                            <TooltipTitle title="Assets" size="sm" className="text"/>
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
                        </div>
                        <NomasSpacer y={4}/>
                        <div className="flex justify-between items-center bg-card-dark-2 p-2 pr-4 radius-card-inner">
                            <SelectToken
                                token={token}
                                chainMetadata={chainManagerObj.getChainById(formik.values.chainId)}
                                onSelect={() => {
                                
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
                <NomasButton className="w-full"
                    isDisabled={!formik.isValid}
                    isLoading={formik.isSubmitting}
                    xlSize
                    onClick={() => {
                        formik.submitForm()
                    }}>
                    Send
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}