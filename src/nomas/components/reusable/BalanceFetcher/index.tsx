import React from "react"
import { useBalance } from "@ciwallet-sdk/hooks"
import { selectTokenById, setBalance, useAppDispatch, useAppSelector } from "@/nomas/redux"
import useSWR from "swr"
import { ChainId, TokenId } from "@ciwallet-sdk/types"

export const BALANCE_FETCHER_KEY = "balance-fetcher"

export interface BalanceFetcherProps {
    tokenId: TokenId
    accountAddress: string
    chainId: ChainId
    isToken2022?: boolean
}

// we create a key for the balance fetcher
export const createBalanceFetcherKey = (tokenId: TokenId, accountAddress: string) => {
    return `${BALANCE_FETCHER_KEY}-${tokenId}-${accountAddress}`
}

export const BalanceFetcher = (
    { 
        tokenId, 
        accountAddress, 
        chainId, 
        isToken2022
    }: BalanceFetcherProps) => {
    const { handle } = useBalance()
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const token = useAppSelector((state) => selectTokenById(state.persists, tokenId))
    const dispatch = useAppDispatch()
    useSWR(
        [BALANCE_FETCHER_KEY, tokenId, accountAddress],
        async () => {
            try {
                const { amount } = await handle({
                    chainId,
                    network,
                    address: accountAddress,
                    tokenAddress: token.address,
                    decimals: token.decimals,
                    rpcs: rpcs[chainId][network],
                    isToken2022,
                })
                dispatch(setBalance({
                    tokenId,
                    balance: amount,
                }))
            } catch (error) {
                console.error(`BalanceFetcher: error fetching balance for token ${tokenId} on chain ${chainId} for account ${accountAddress}, error: ${error}`)
            }
        },
        {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    )
    return (
        <></>
    )
}