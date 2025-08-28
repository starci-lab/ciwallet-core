import React from "react"
import { NomasAvatar } from "../../extends"
import { ChainId, type Token } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { useAppSelector } from "@/nomas/redux"

export interface TokenCardProps {   
    token: Token
    chainId: ChainId
    onPress?: () => void
}

export const TokenCard = ({ token, chainId, onPress }: TokenCardProps) => {
    const { handle } = useBalance()
    const network = useAppSelector(state => state.base.network)
    const { data } = useSWR(
        ["balance", token.address, network, token.address],
        () => {
            return handle({
                chainId,
                network,    
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                tokenAddress: token.address,
            }).then(res => res.amount)
        }
    )
    return (
        <div className="flex justify-between items-center" onClick={onPress}>
            <div className="flex gap-2 items-center">
                <div className="relative">
                    <NomasAvatar src={token.iconUrl} />
                    <NomasAvatar
                        src={token.iconUrl}
                        className="absolute bottom-0 right-0 z-50"
                        dimension="shrink"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm">{token.name}</div>
                    <div className="text-xs text-foreground-500">{token.symbol}</div>
                </div>
            </div>
            <div>
                <div className="text-sm">{data}</div>
                <div className="text-xs text-foreground-500">0</div>
            </div>
        </div>
    )
}