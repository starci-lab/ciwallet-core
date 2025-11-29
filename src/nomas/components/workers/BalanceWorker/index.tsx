import { selectSelectedAccounts, selectTokens, useAppSelector } from "@/nomas/redux"
import { BalanceFetcher } from "../../reusable"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export const BalanceWorker = () => {
    // retrieve all tokens
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const accounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    // if token changes, we need to fetch the balance for the new token
    return (
        <> 
            {
                tokens.map((token) => (
                    <BalanceFetcher 
                        key={token.tokenId} 
                        tokenId={token.tokenId} 
                        accountAddress={accounts[chainIdToPlatform(token.chainId)]?.accountAddress ?? ""} 
                        chainId={token.chainId}
                    />
                ))
            } </>
    )
}