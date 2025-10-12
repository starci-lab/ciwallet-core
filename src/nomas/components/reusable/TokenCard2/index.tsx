import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasImage, NomasSpinner } from "../../extends"
import { ChainId, Network, type Token } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { chainManagerObj } from "@/nomas/obj"
import { useAppSelector } from "@/nomas/redux"

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
    accountAddress, 
    network 
}: TokenCard2Props) => {
    const chain = chainManagerObj.getChainById(chainId)
    const { handle } = useBalance()
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { data, isLoading } = useSWR(
        ["potfolio-balance", token.address, chainId, token.address],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: accountAddress,
                tokenAddress: token.address,
                decimals: token.decimals,
                rpcs: rpcs[chainId][network],
            })
            return amount
        }
    )
    return (
        <NomasCard
            variant={NomasCardVariant.Transparent}
            className="flex items-center cursor-pointer"
            onClick={onClick}
        >
            <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-4">
                {/* Left: token info */}
                <div className="flex flex-row items-center gap-2">
                    <div className="relative">
                        <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                        <NomasImage src={chain?.iconUrl} className="absolute bottom-0 right-0 z-50 w-5 h-5 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm text">{token.name}</div>
                        <div className="text-xs text-foreground-500 text-muted">{token.symbol}</div>
                    </div>
                </div>
        
                {/* Right: balance */}
                {isLoading ? (
                    <NomasSpinner/>
                ) : (
                    <div>
                        <div className="flex flex-col text-right"></div>
                        <div className="flex flex-col text-right">
                            <div className="text-sm text">{data ?? "--"}</div>
                            <div className="text-xs text-foreground-500 text-muted">$0</div>
                        </div>
                    </div>
                )}
            </NomasCardBody>
        </NomasCard>
    )
}