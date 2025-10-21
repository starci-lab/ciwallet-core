import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage } from "../../extends"
import { ChainId, type Token } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { useAppSelector } from "@/nomas/redux"
import { chainManagerObj } from "@/nomas/obj"

export interface TokenCardProps {   
    token: Token
    chainId: ChainId
    onPress?: () => void
    isPressable?: boolean
}

export const TokenCard = ({ token, chainId, onPress }: TokenCardProps) => {
    const { handle } = useBalance()
    const network = useAppSelector(state => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { data } = useSWR(
        ["balance", token.address, chainId, network, token.address],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                tokenAddress: token.address,
                decimals: token.decimals,
                rpcs: rpcs[chainId][network],
            })
            return amount
        }
    )
    return (
        <NomasCard
            className="flex items-center cursor-pointer"
            onClick={onPress}
            variant={NomasCardVariant.Transparent}
        >
            <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2">
                {/* Left: token info */}
                <div className="flex flex-row items-center gap-2">
                    <div className="relative">
                        <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                        <NomasImage src={chainManagerObj.getChainById(chainId)?.iconUrl} className="absolute bottom-0 right-0 z-50 w-5 h-5 rounded-full" />
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