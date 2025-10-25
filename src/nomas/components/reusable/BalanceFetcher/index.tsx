import React from "react"
import { useBalance } from "@ciwallet-sdk/hooks"
import { selectTokenById, useAppSelector } from "@/nomas/redux"
import useSWR from "swr"
import { ChainId, TokenId } from "@ciwallet-sdk/types"
import EventEmitter from "events"

export const BALANCE_FETCHER_KEY = "balance-fetcher"
export interface BalanceFetcherProps {
    tokenId: TokenId
    accountAddress: string
    chainId: ChainId
}

// we declare a event bus to emit the balance
export const balanceFetcherEventBus = new EventEmitter()

// we create a key for the balance fetcher
export const createBalanceFetcherKey = (tokenId: TokenId, accountAddress: string) => {
    return `${BALANCE_FETCHER_KEY}-${tokenId}-${accountAddress}`
}

export const BalanceFetcher = ({ tokenId, accountAddress, chainId }: BalanceFetcherProps) => {
    const { handle } = useBalance()
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const token = useAppSelector((state) => selectTokenById(state.persists, tokenId))
    useSWR(
        [BALANCE_FETCHER_KEY, tokenId, accountAddress],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: accountAddress,
                tokenAddress: token.address,
                decimals: token.decimals,
                rpcs: rpcs[chainId][network],
            })
            // we emit the balance to the event bus
            balanceFetcherEventBus.emit(
                createBalanceFetcherKey(tokenId, accountAddress), {
                    tokenId,
                    accountAddress,
                    chainId,
                    amount,
                })
        }
    )
    return (
        <></>
    )
}