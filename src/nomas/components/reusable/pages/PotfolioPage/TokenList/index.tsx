import React from "react"
import { TokenCard2 } from "../../../TokenCard2"
import { useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody } from "../../../../extends"

export const TokenList = () => {
    const tokenManager = useAppSelector((state) => state.token.manager)
    const potfolioChainId = useAppSelector((state) => state.potfolio.chainId)
    const network = useAppSelector((state) => state.base.network)
    const tokens = tokenManager.getTokensByChainIdAndNetwork(potfolioChainId, network)
    return (
        <NomasCard className="bg-content3">
            <NomasCardBody>
                <div className="flex flex-col gap-4">
                    {tokens.map((token) => {
                        return <TokenCard2 chainId={potfolioChainId} token={token} key={token.tokenId} />
                    })}
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}