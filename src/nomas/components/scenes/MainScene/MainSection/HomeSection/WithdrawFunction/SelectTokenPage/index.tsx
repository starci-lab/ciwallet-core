import React, { useMemo } from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
    NomasInput,
    NotFound,
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
import { ChainId, Platform, TokenId, TokenType } from "@ciwallet-sdk/types"
import Decimal from "decimal.js"
import { chainManagerObj } from "@/nomas/obj"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const formik = useTransferFormik()
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const filteredTokenArray = useMemo(() => {
        return tokenArray.filter((token) => {
            const filteredTokens = (
                token.name.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
                || token.symbol.toLowerCase().includes(formik.values.searchTokenQuery.toLowerCase()) 
                || token.address?.toLowerCase()?.includes(formik.values.searchTokenQuery.toLowerCase())
            )
            if (formik.values.chainId === "all-network") {
                return filteredTokens
            }
            return filteredTokens && token.chainId === formik.values.chainId
        })
    }, [tokenArray, formik.values.searchTokenQuery])

    const platform = useMemo(() => {
        if (!formik.values.tokenId) return undefined
        const token = tokenArray.find((token) => token.tokenId === formik.values.tokenId)
        if (!token) return undefined
        return chainIdToPlatform(token.chainId)
    }, [formik.values.tokenId, tokenArray])

    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform ?? Platform.Evm))
    const network = useAppSelector((state) => state.persists.session.network)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
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
                    <NomasCardBody className="gap-2 p-0" scrollable scrollHeight={300}>
                        {
                            filteredTokenArray.length ?
                                filteredTokenArray.map((token) => (
                                    <TokenCard2 
                                        isPressable
                                        onClick={() => {
                                            formik.setFieldValue("tokenId", token.tokenId)
                                            const gasToken = tokenArray.find((_token) => 
                                                _token.chainId === token.chainId
                                                && _token.network === network 
                                                && _token.type === TokenType.Native
                                            )
                                            formik.setFieldValue("gasTokenId", gasToken?.tokenId)
                                            formik.setFieldValue("platform", chainIdToPlatform(token.chainId))
                                            const chainMetadata = chainManagerObj.getChainById(gasToken?.chainId ?? ChainId.Monad)
                                            formik.setFieldValue("isEnoughGasBalance", new Decimal(balances[gasToken?.tokenId ?? TokenId.MonadTestnetMon] ?? 0).gte(chainMetadata?.minimumGasRequired ?? 0))
                                            dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.Withdraw))
                                        }}
                                        key={token.tokenId}
                                        token={token}
                                        chainId={token.chainId}
                                        accountAddress={selectedAccount?.accountAddress ?? ""}
                                        network={network}
                                    />
                                )) 
                                : <NotFound title="No tokens found" />}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}
