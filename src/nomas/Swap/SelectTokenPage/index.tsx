import React from "react"
import {
    NomasAvatar,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    TokenCard,
} from "../../components"
import {
    setSwapPage,
    SwapPageState,
    useAppDispatch,
    useAppSelector,
    setTokenIn,
    setTokenOut,
    setTokenOutChainId,
    setTokenInChainId,
} from "../../redux"
import { ChainId } from "@ciwallet-sdk/types"
import { Spacer } from "@heroui/react"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const chainManager = useAppSelector((state) => state.chain.manager)
    const tokenInChainId =
    useAppSelector((state) => state.swap.tokenInChainId) ?? ChainId.Monad
    const tokenOutChainId =
    useAppSelector((state) => state.swap.tokenOutChainId) ?? ChainId.Monad
    const tokenManager = useAppSelector((state) => state.token.manager)
    const isInput = useAppSelector((state) => state.swap.isInput)
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
                        <div className="flex gap-4 items-center">
                            {chainManager.toObject().map((chain) =>
                                (() => {
                                    const isSelected = isInput
                                        ? tokenInChainId === chain.id
                                        : tokenOutChainId === chain.id
                                    if (isSelected) {
                                        return (
                                            <NomasCard
                                                key={chain.id}
                                                className="px-2 py-1.5 flex-row flex items-center gap-2 bg-default"
                                            >
                                                <NomasAvatar
                                                    dimension="origin"
                                                    src={chain.iconUrl}
                                                    alt={chain.name}
                                                />
                                                <div>{chain.name}</div>
                                            </NomasCard>
                                        )
                                    }
                                    return (
                                        <NomasAvatar
                                            onClick={
                                                () => {
                                                    if (isInput) {
                                                        dispatch(setTokenInChainId(chain.id))
                                                    } else {
                                                        dispatch(setTokenOutChainId(chain.id))
                                                    }
                                                }
                                            }   
                                            key={chain.id}
                                            dimension="origin"
                                            src={chain.iconUrl}
                                            alt={chain.name}
                                        />
                                    )
                                })()
                            )}
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <Spacer y={4}/>
                <NomasCard className="bg-content3">
                    <NomasCardBody className="gap-2">
                        {tokenManager
                            .getTokensByChainIdAndNetwork(tokenInChainId, network)
                            .map((token) => {
                                return (
                                    <TokenCard
                                        isPressable={true}
                                        onPress={
                                            () => {
                                                if (isInput) {
                                                    dispatch(setTokenIn(token))
                                                } else {
                                                    dispatch(setTokenOut(token))
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
