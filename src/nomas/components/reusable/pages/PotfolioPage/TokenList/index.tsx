import React from "react"
import { TokenCard2 } from "../../../TokenCard2"
import { selectTokens, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody } from "../../../../extends"

export const TokenList = () => {
    const tokens = useAppSelector((state) => selectTokens(state.persists))
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