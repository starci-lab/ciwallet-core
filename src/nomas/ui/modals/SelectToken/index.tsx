import React from "react"
import { NomasAvatar, NomasCard, NomasModal, NomasModalBody, TokenCard } from "@/nomas/components"
import { NomasModalContent, NomasModalHeader } from "@/nomas/components"
import { useSelectTokenDisclosure } from "@/nomas/hooks"
import { setTokenInChainId, setTokenOutChainId, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"

export const SelectTokenModal = () => {
    const { isOpen, onOpenChange } = useSelectTokenDisclosure()
    const chainManager = useAppSelector(state => state.chain.manager)
    const tokenManager = useAppSelector(state => state.token.manager)
    const dispatch = useAppDispatch()
    // redux states
    const isInput = useAppSelector(state => state.modals.selectToken.isInput)
    const tokenIn = useAppSelector(state => state.swap.tokenIn)
    const tokenOut = useAppSelector(state => state.swap.tokenOut)
    const tokenInChainId = useAppSelector(state => state.swap.tokenInChainId)
    const tokenOutChainId = useAppSelector(state => state.swap.tokenOutChainId)
    const network = useAppSelector(state => state.base.network)

    const tokens = tokenManager.getTokensByChainIdAndNetwork(
        tokenInChainId ?? ChainId.Monad,
        network
    )
    return (
        <NomasModal isOpen={isOpen} onOpenChange={onOpenChange}>
            <NomasModalContent>
                <NomasModalHeader>Choose token</NomasModalHeader>
                <NomasModalBody>   
                    <div className="flex gap-4 items-center">
                        {chainManager.toObject().map((chain) => (
                            (() => {
                                const isSelected 
                            = isInput ? tokenInChainId === chain.id : tokenOutChainId === chain.id
                                if (isSelected) {
                                    return <NomasCard key={chain.id} className="px-2 py-1.5 flex-row flex items-center gap-2">
                                        <NomasAvatar
                                            dimension="origin"
                                            src={chain.iconUrl}
                                            alt={chain.name}
                                        />  
                                        <div>{chain.name}</div>
                                    </NomasCard>
                                } 
                                return <NomasAvatar
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
                            })()
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {tokens.map((token) => (
                                <TokenCard key={token.tokenId} token={token} chainId={tokenInChainId ?? ChainId.Monad} />
                            ))}
                        </div>
                    </div>
                </NomasModalBody>
            </NomasModalContent>
        </NomasModal>
    )
}
