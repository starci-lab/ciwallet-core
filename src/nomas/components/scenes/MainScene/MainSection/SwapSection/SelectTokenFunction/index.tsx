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
    setSwapFunctionPage,
    SwapFunctionPage,
    useAppDispatch,
    useAppSelector
} from "@/nomas/redux"
import { NomasSpacer } from "@/nomas/components"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { SelectChainTab } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const SelectTokenFunction = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const filteredTokenArray = useMemo(() => {
        return tokenArray.filter((token) => {
            return token.name.toLowerCase().includes(swapFormik.values.searchTokenQuery.toLowerCase()) 
            || token.symbol.toLowerCase().includes(swapFormik.values.searchTokenQuery.toLowerCase()) 
            || token.address?.toLowerCase()?.includes(swapFormik.values.searchTokenQuery.toLowerCase())
        })
    }, [tokenArray, swapFormik.values.searchTokenQuery])
    const platform = useMemo(()     => {
        return chainIdToPlatform(swapFormik.values.tokenInChainId)
    }, [swapFormik.values.tokenInChainId])
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const network = useAppSelector((state) => state.persists.session.network)
    return (
        <>
            <NomasCardHeader
                title="Select Token"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
            />
            <NomasCardBody>
                <SelectChainTab
                    isSelected={(chainId) => swapFormik.values.searchSelectedChainId === chainId}
                    onClick={() => {
                        dispatch(setSwapFunctionPage(SwapFunctionPage.ChooseNetwork))
                    }}
                    withAllNetworks={true}
                />
                <NomasSpacer y={4}/>
                <NomasInput 
                    placeholder="Search token by name, symbol, or address"
                    onValueChange={(value) => {
                        swapFormik.setFieldValue("searchTokenQuery", value)
                    }}
                    value={swapFormik.values.searchTokenQuery}
                />
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="gap-2 p-0" scrollable scrollHeight={300}>
                        {filteredTokenArray.map((token) => (
                            <TokenCard2 
                                isPressable
                                onClick={() => {
                                    if (swapFormik.values.isTokenInClicked) {
                                        swapFormik.setFieldValue("tokenIn", token.tokenId)
                                        swapFormik.setFieldValue("tokenInChainId", token.chainId)
                                    } else {
                                        swapFormik.setFieldValue("tokenOut", token.tokenId)
                                        swapFormik.setFieldValue("tokenOutChainId", token.chainId)
                                    }
                                    // reset the search token query
                                    swapFormik.setFieldValue("searchTokenQuery", "")
                                    // reset the search selected chain id
                                    swapFormik.setFieldValue("searchSelectedChainId", "all-network")
                                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                                }}
                                key={token.tokenId}
                                token={token}
                                chainId={token.chainId}
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
