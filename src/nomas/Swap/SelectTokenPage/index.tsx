import React from "react"
import {
    NomasAvatar,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "../../components"
import {
    setSwapPage,
    SwapPageState,
    useAppDispatch,
    useAppSelector,
    setTokenInChainId,
    setTokenOutChainId,
} from "../../redux"

export const SelectTokenPage = () => {
    const dispatch = useAppDispatch()
    const chainManager = useAppSelector((state) => state.chain.manager)
    const tokenInChainId = useAppSelector((state) => state.swap.tokenInChainId)
    const tokenOutChainId = useAppSelector((state) => state.swap.tokenOutChainId)
    const isInput = useAppSelector((state) => state.swap.isInput)
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
                                            as="button"
                                            onClick={() => {
                                                if (isInput) {
                                                    dispatch(setTokenInChainId(chain.id))
                                                } else {
                                                    dispatch(setTokenOutChainId(chain.id))
                                                }
                                            }}
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
            </NomasCardBody>
        </>
    )
}
