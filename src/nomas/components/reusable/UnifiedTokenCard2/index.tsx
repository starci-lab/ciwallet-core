import React from "react"
import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../extends"
import { type UnifiedToken } from "@ciwallet-sdk/types"
import { useAppSelector, type TokenItem, selectTokens } from "@/nomas/redux"
import { roundNumber } from "@ciwallet-sdk/utils"
import { PressableMotion } from "../../styled"

export interface UnifiedTokenCard2Props {
  token: UnifiedToken
  onClick?: () => void
  isPressable?: boolean
  tokens: Array<TokenItem>
}

export const UnifiedTokenCard2 = ({
    token,
    onClick,
    isPressable = false,
}: UnifiedTokenCard2Props) => {
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const tokenIds = [
        ...new Set(
            tokenArray.filter((_token) => {
                return _token.unifiedTokenId === token.unifiedTokenId
            })
                .map((token) => token.tokenId)
        )
    ]
    const totalBalance = tokenIds.reduce((acc, tokenId) => acc + (balances[tokenId] ?? 0), 0)
    const prices = useAppSelector((state) => state.stateless.dynamic.unifiedPrices)
    const price = prices[token.unifiedTokenId]
    const content = () => {
        return (
            <NomasCard
                variant={NomasCardVariant.Transparent}
                className="flex items-center cursor-pointer select-none"
                onClick={onClick}
            >
                <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-4">
                    {/* Left: token info */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm text-text">{token.name}</div>
                            <div className="text-xs text-muted">{token.symbol}</div>
                        </div>
                    </div>
                    {/* Right: balance */}
                    <div className="flex flex-col text-right">
                        <div className="text-sm text-text">{roundNumber(totalBalance ?? 0, 5)}</div>
                        <div className="text-xs text-muted">${roundNumber((totalBalance) * (price ?? 0), 5)}</div>
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
