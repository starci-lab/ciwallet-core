import React from "react"
import { NomasImage } from "../../../../../../../extends"
import type { ChainMetadata } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { useAppSelector } from "@/nomas/redux/hooks"
import { BALANCE_FETCHER_KEY } from "@/nomas/components"

export interface ChainDetailsProps {
    chain: ChainMetadata
    accountAddress: string
    tokenAddress: string
    decimals: number
}

export const ChainDetails = ({ chain, accountAddress, tokenAddress, decimals }: ChainDetailsProps) => {
    const { handle} = useBalance()
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { data, isLoading } = useSWR(
        [BALANCE_FETCHER_KEY, chain.id],
        async () => {
            const { amount } = await handle({
                chainId: chain.id,
                network,
                address: accountAddress,
                tokenAddress,
                decimals,
                rpcs: rpcs[chain.id][network],
            })
            return amount
        }
    )   
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <NomasImage src={chain?.iconUrl} className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                    <div className="text-sm">{chain?.name}</div>
                </div>
            </div>
            <div className="flex flex-col text-right">
                <div className="text-sm">{data ?? "--"}</div>
                <div className="text-xs text-muted">{isLoading ? "Loading..." : "--"}</div>
            </div>
        </div>
    )
}   