import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasCardVariant,
} from "@/nomas/components"
import {
    selectSelectedAccountByChainId,
    setSwapFunctionPage,
    SwapFunctionPage,
    useAppDispatch,
    useAppSelector
} from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { NomasSpacer } from "@/nomas/components"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { TokenCard2 } from "@/nomas/components"
import { SelectChainTab } from "@/nomas/components"
import { tokenManagerObj } from "@/nomas/obj"

export const SelectTokenFunction = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const tokenManager = tokenManagerObj
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByChainId(state.persists, swapFormik.values.tokenInChainId ?? ChainId.Monad))
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
                    isSelected={(chainId) => swapFormik.values.isInput ? swapFormik.values.tokenInChainId === chainId : swapFormik.values.tokenOutChainId === chainId}
                    onClick={() => {
                        dispatch(setSwapFunctionPage(SwapFunctionPage.ChooseNetwork))
                    }}
                />
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="gap-2 p-0">
                        {tokenManager
                            .getTokensByChainIdAndNetwork(swapFormik.values.tokenInChainId ?? ChainId.Monad, network)
                            .map((token) => {
                                return (
                                    <TokenCard2
                                        network={network}
                                        accountAddress={selectedAccount?.accountAddress ?? ""}
                                        chainId={tokenManager.getChainIdByTokenId(token.tokenId) ?? ChainId.Monad}
                                        onClick={
                                            () => {
                                                if (swapFormik.values.isInput) {
                                                    swapFormik.setFieldValue("tokenIn", token.tokenId)
                                                } else {
                                                    swapFormik.setFieldValue("tokenOut", token.tokenId)
                                                }
                                                dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                                            }
                                        }
                                        key={token.tokenId}
                                        token={token}
                                    />
                                )
                            })}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}
