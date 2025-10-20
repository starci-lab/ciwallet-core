import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "@/nomas/components"
import {
    setSwapPage,
    SwapPage,  
    useAppDispatch,
    useAppSelector
} from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { NomasSpacer } from "@/nomas/components"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { TokenCard } from "@/nomas/components"
import { SelectChainTab } from "@/nomas/components"
import { tokenManagerObj } from "@/nomas/obj"

export const SelectTokenFunction = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const tokenManager = tokenManagerObj
    const network = useAppSelector((state) => state.persists.session.network)
    return (
        <>
            <NomasCardHeader
                title="Select Token"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapPage(SwapPage.Swap))
                }}
            />
            <NomasCardBody>
                <NomasCard>
                    <NomasCardBody>
                        <SelectChainTab
                            isSelected={(chainId) => swapFormik.values.isInput ? swapFormik.values.tokenInChainId === chainId : swapFormik.values.tokenOutChainId === chainId}
                            onClick={() => {
                                dispatch(setSwapPage(SwapPage.SelectToken))
                            }}
                        />
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4}/>
                <NomasCard>
                    <NomasCardBody className="gap-2">
                        {tokenManager
                            .getTokensByChainIdAndNetwork(swapFormik.values.tokenInChainId ?? ChainId.Monad, network)
                            .map((token) => {
                                return (
                                    <TokenCard
                                        isPressable={true}
                                        onPress={
                                            () => {
                                                if (swapFormik.values.isInput) {
                                                    swapFormik.setFieldValue("tokenIn", token.tokenId)
                                                } else {
                                                    swapFormik.setFieldValue("tokenOut", token.tokenId)
                                                }
                                                dispatch(setSwapPage(SwapPage.Swap))
                                            }
                                        }
                                        key={token.tokenId}
                                        token={token}
                                        chainId={tokenManager.getChainIdByTokenId(token.tokenId) ?? ChainId.Monad}
                                    />
                                )
                            })}
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}
