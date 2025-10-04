import React from "react"
import { NomasAvatar, NomasCard, NomasCardBody } from "../../extends"
import { ChainId, type Token } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { useAppSelector } from "@/nomas/redux"

export interface TokenCardProps {   
    token: Token
    chainId: ChainId
    onPress?: () => void
    isPressable?: boolean
}

export const TokenCard = ({ token, chainId, onPress, isPressable = true }: TokenCardProps) => {
    const { handle } = useBalance()
    const chainManager = useAppSelector(state => state.chain.manager)
    const network = useAppSelector(state => state.base.network)
    const { data } = useSWR(
        ["balance", token.address, network, token.address],
        async () => {
            return await handle({
                chainId,
                network,    
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                tokenAddress: token.address,
            }).then(res => res.amount)
        }
    )
    const chain = chainManager.getChainById(chainId)
    return (
        <NomasCard
            isPressable={isPressable}
            className="flex items-center"
            onClick={onPress}
        >
            <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2">
                {/* Left: token info */}
                <div className="flex flex-row items-center gap-2">
                    <div className="relative">
                        <NomasAvatar src={token.iconUrl} />
                        <NomasAvatar
                            src={chain?.iconUrl}
                            className="absolute bottom-0 right-0 z-50"
                            dimension="shrink"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">{token.name}</div>
                        <div className="text-xs text-foreground-500 text-left">{token.symbol}</div>
                    </div>
                </div>
        
                {/* Right: balance */}
                <div className="flex flex-col text-right">
                    <div className="text-sm font-medium">{data ?? "--"}</div>
                    <div className="text-xs text-foreground-500">0</div>
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}