import React from "react"
import { NomasAvatar, NomasCard, NomasModal, NomasModalBody, TokenCard } from "@/nomas/components"
import { NomasModalContent, NomasModalHeader } from "@/nomas/components"
import { useSelectTokenDisclosure, useSwapFormik } from "@/nomas/hooks"
import { useAppSelector } from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"

export const SelectTokenModal = () => {
    const { isOpen, onOpenChange } = useSelectTokenDisclosure()
    const chainManager = useAppSelector(state => state.chain.manager)
    const tokenManager = useAppSelector(state => state.token.manager)
    // redux states
    const swapFormik = useSwapFormik()
    const network = useAppSelector(state => state.base.network)

    const tokens = tokenManager.getTokensByChainIdAndNetwork(
        swapFormik.values.tokenInChainId ?? ChainId.Monad,
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
                                const isSelected = swapFormik.values.isInput 
                                    ? swapFormik.values.tokenInChainId === chain.id
                                    : swapFormik.values.tokenOutChainId === chain.id
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
                                        if (swapFormik.values.isInput) {
                                            swapFormik.setFieldValue("tokenInChainId", chain.id)
                                        } else {
                                            swapFormik.setFieldValue("tokenOutChainId", chain.id)
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
                                <TokenCard onPress={() => {
                                    if (swapFormik.values.isInput) {
                                        swapFormik.setFieldValue("tokenIn", token.tokenId)
                                    } else {
                                        swapFormik.setFieldValue("tokenOut", token.tokenId)
                                    }
                                }} key={token.tokenId} token={token} chainId={swapFormik.values.tokenInChainId ?? ChainId.Monad} />
                            ))}
                        </div>
                    </div>
                </NomasModalBody>
            </NomasModalContent>
        </NomasModal>
    )
}
