import { ChainId } from "@ciwallet-sdk/types"
import { WalletKitProvider } from "@ciwallet-sdk/providers"
import React from "react"
import { Swap } from "./Swap"

export const Nomas = () => {
    return (
        <WalletKitProvider context={{
            adapter: {
                aggregators: {
                    ciAggregator: {
                        url: "http://localhost:3000"
                    }
                },
                chains: [
                    {
                        chainId: ChainId.Monad,
                        rpcs: [
                            "https://testnet-rpc.monad.xyz"
                        ]
                    }
                ],
            },
            
        }}>
            <Swap/> 
        </WalletKitProvider>
    )
}