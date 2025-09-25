import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "../../../extends"
import {
    setSwapPage,
    SwapPageState,
    useAppDispatch,
    useAppSelector
} from "../../../../redux"
import { ChainId } from "@ciwallet-sdk/types"
import { Spacer } from "@heroui/react"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { TokenCard } from "../../TokenCard"
import { SelectChainTab } from "../../../styled"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const chainManager = useAppSelector((state) => state.chain.manager)
    const swapFormik = useSwapFormik()
    const tokenManager = useAppSelector((state) => state.token.manager)
    const network = useAppSelector((state) => state.base.network)
    return (
        <>
            <NomasCardHeader
                title="Select Token"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapPage(SwapPageState.Swap))
                }}
            />
            <NomasCardBody>
                <NomasCard className="bg-content3">
                    <NomasCardBody>
                        <SelectChainTab
                            chainManager={chainManager}
                            isSelected={(chainId) => swapFormik.values.isInput ? swapFormik.values.tokenInChainId === chainId : swapFormik.values.tokenOutChainId === chainId}
                            onSelect={(chainId) => {
                                swapFormik.setFieldValue("tokenInChainId", chainId)
                            }}
                        />
                    </NomasCardBody>
                </NomasCard>
                <Spacer y={4}/>
                <NomasCard className="bg-content3">
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
                                                dispatch(setSwapPage(SwapPageState.Swap))
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
