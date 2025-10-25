import React from "react"
import { NomasImage } from "../../../../../../../extends"
import type { ChainMetadata, TokenId } from "@ciwallet-sdk/types"
import { useAppDispatch, useAppSelector } from "@/nomas/redux/hooks"
import { computePercentage, roundNumber } from "@ciwallet-sdk/utils"
import { motion } from "framer-motion"
import { SelectedTokenType, selectTokens, setSelectedChainId } from "@/nomas/redux"

export interface ChainDetailsProps {
    chain: ChainMetadata
    tokenId: TokenId
}

export const ChainDetails = ({ chain, tokenId }: ChainDetailsProps) => {
    const dispatch = useAppDispatch()
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const balance = balances[tokenId]
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const price = prices[tokenId]
    const selectedTokenType = useAppSelector((state) => state.persists.session.selectedTokenType)
    const selectedTokenId = useAppSelector((state) => state.persists.session.selectedTokenId)
    const selectedUnifiedTokenId = useAppSelector((state) => state.persists.session.selectedUnifiedTokenId)
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const tokenIds = [
        ...new Set(tokenArray.filter((token) => {
            if (selectedTokenType === SelectedTokenType.Token) {
                return token.tokenId === selectedTokenId
            } else {
                return token.unifiedTokenId === selectedUnifiedTokenId
            }
        })
            .map((token) => token.tokenId))
    ]
    const totalBalance = tokenIds.reduce((acc, tokenId) => acc + (balances[tokenId] ?? 0), 0)
    const percentage = computePercentage(balance ?? 0, totalBalance ?? 0)
    return (
        <motion.div
            className="cursor-pointer select-none"
            onClick={() => {
                dispatch(setSelectedChainId(chain.id))
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <NomasImage src={chain?.iconUrl} className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                        <div className="text-sm">{chain?.name}</div>
                        <div className="text-xs text-muted">{percentage}%</div>
                    </div>
                </div>
                <div className="flex flex-col text-right">
                    <div className="text-sm">{balance ?? "--"}</div>
                    <div className="text-xs text-muted">{roundNumber((balance ?? 0) * (price ?? 0), 5) ?? "--"}</div>
                </div>
            </div>
        </motion.div>
    )
}   