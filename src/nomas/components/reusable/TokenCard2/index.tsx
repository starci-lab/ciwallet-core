import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage } from "../../extends"
import { ChainId, Network, type Token } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"
import { useAppSelector } from "@/nomas/redux"
import { roundNumber } from "@ciwallet-sdk/utils"
import { PressableMotion } from "../../styled"

export interface TokenCard2Props {   
    token: Token
    chainId: ChainId
    onClick?: () => void
    isPressable?: boolean
    accountAddress: string
    network: Network
}

export const TokenCard2 = ({ 
    token, 
    chainId, 
    onClick, 
    isPressable = false,
}: TokenCard2Props) => {
    const chain = chainManagerObj.getChainById(chainId)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const balance = balances[token.tokenId]
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const price = prices[token.tokenId]
    const content = () => {
        return (
            <NomasCard
                variant={NomasCardVariant.Transparent}
                className="flex items-center cursor-pointer"
            >
                <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-4">
                    {/* Left: token info */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                            <NomasImage src={chain?.iconUrl} className="absolute bottom-0 right-0 z-50 w-5 h-5 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm text-text">{token.name}</div>
                            <div className="text-xs text-muted">{token.symbol}</div>
                        </div>
                    </div>
        
                    {/* Right: balance */}
                    <div className="flex flex-col text-right">
                        <div className="text-sm text-text">{roundNumber(balance ?? 0, 5)}</div>
                        <div className="text-xs text-foreground-500 text-muted">${roundNumber((balance ?? 0) * (price ?? 0), 5)}</div>
                    </div>
                </NomasCardBody>
            </NomasCard>
        )
    }
    return (
        isPressable ? (
            <PressableMotion onClick={onClick}>
                {content()}
            </PressableMotion>
        ) : (
            content()
        )
    )
}