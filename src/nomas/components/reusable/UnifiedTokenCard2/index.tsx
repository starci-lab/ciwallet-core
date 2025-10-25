import React from "react"
import { motion } from "framer-motion"
import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../extends"
import { type UnifiedToken } from "@ciwallet-sdk/types"
import { BalanceFetcher } from "../BalanceFetcher"
import { useAppSelector, type TokenItem, selectTokens } from "@/nomas/redux"
import { roundNumber } from "@ciwallet-sdk/utils"


export interface UnifiedTokenCard2Props {
  token: UnifiedToken
  onClick?: () => void
  isPressable?: boolean
  tokens: Array<TokenItem>
}

export const UnifiedTokenCard2 = ({
    token,
    onClick,
    tokens,
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
    return (
        <>
            {/* balance listeners */}
            {tokens.map((t) => (
                <BalanceFetcher
                    key={t.tokenId}
                    tokenId={t.tokenId}
                    accountAddress={t.accountAddress}
                    chainId={t.chainId}
                />
            ))}

            {/* Motion wrapper */}
            <motion.div
                whileTap={isPressable ? { scale: 0.96 } : {}}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
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
                                <div className="text-sm text">{token.name}</div>
                                <div className="text-xs text-muted">{token.symbol}</div>
                            </div>
                        </div>
                        {/* Right: balance */}
                        <div className="flex flex-col text-right">
                            <div className="text-sm text">{totalBalance}</div>
                            <div className="text-xs text-muted">${roundNumber((totalBalance) * (price ?? 0), 5)}</div>
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </motion.div>
        </>
    )
}
