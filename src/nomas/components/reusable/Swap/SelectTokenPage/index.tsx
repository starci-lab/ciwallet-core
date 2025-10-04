import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "../../../extends"
import {
    setSwapPage,
    SwapPage,  
    useAppDispatch,
    useAppSelector
} from "../../../../redux"
import { ChainId } from "@ciwallet-sdk/types"
import { Spacer } from "@heroui/react"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { TokenCard } from "../../TokenCard"
import { SelectChainTab } from "../../../styled"
import { tokenManagerObj } from "@/nomas/obj"
import { chainManagerObj } from "@/nomas/obj"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const tokenManager = tokenManagerObj
    const network = useAppSelector((state) => state.persits.session.network)
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
                            chainManager={chainManagerObj}
                            isSelected={(chainId) => swapFormik.values.isInput ? swapFormik.values.tokenInChainId === chainId : swapFormik.values.tokenOutChainId === chainId}
                            onSelect={(chainId) => {
                                swapFormik.setFieldValue("tokenInChainId", chainId)
                            }}
                        />
                    </NomasCardBody>
                </NomasCard>
                <Spacer y={4}/>
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
