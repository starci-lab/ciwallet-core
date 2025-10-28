import React, { useMemo } from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
    NomasInput,
    TokenCard2,
} from "@/nomas/components"
import {
    selectSelectedAccountByPlatform,
    selectTokens,
    setWithdrawFunctionPage,
    useAppDispatch,
    useAppSelector,
    WithdrawFunctionPage
} from "@/nomas/redux"
import { NomasSpacer } from "@/nomas/components"
import { useTransferFormik } from "@/nomas/hooks/singleton"
import { SelectChainTab } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const formik = useTransferFormik()
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const filteredTokenArray = useMemo(() => {
        return tokenArray.filter((token) => {
            return token.name.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
            || token.symbol.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
            || token.address?.toLowerCase()?.includes(formik.values.searchTokenQuery.toLowerCase())
        })
    }, [tokenArray, formik.values.searchTokenQuery])
    const platform = useMemo(()     => {
        return chainIdToPlatform(formik.values.chainId)
    }, [formik.values.chainId])
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const network = useAppSelector((state) => state.persists.session.network)
    return (
        <>
            <NomasCardHeader
                title="Select Token"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                }}
            />
            <NomasCardBody>
                <SelectChainTab
                    isSelected={(chainId) => formik.values.chainId === chainId}
                    onClick={() => {
                        dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.ChooseNetwork))
                    }}
                    withAllNetworks={true}
                />
                <NomasSpacer y={4}/>
                <NomasInput 
                    placeholder="Search token by name, symbol, or address"
                    onValueChange={(value) => {
                        formik.setFieldValue("searchTokenQuery", value)
                    }}
                    value={formik.values.searchTokenQuery}
                />
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="gap-2 p-0">
                        {filteredTokenArray.map((token) => (
                            <TokenCard2 
                                isPressable
                                onClick={() => {
                                    formik.setFieldValue("tokenId", token.tokenId)
                                    dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                                }}
                                key={token.tokenId}
                                token={token}
                                chainId={formik.values.chainId}
                                accountAddress={selectedAccount?.accountAddress ?? ""}
                                network={network}
                            />
                        ))}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}
