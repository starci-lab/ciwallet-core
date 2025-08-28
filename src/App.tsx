import React from "react"
import { Nomas } from "./nomas"
import { HeroUIProvider } from "@heroui/react"
import { Provider } from "react-redux"
import { store } from "@/nomas/redux"
import { HookProvider } from "@/nomas/hooks"
import { UI } from "@/nomas/ui"
import { WalletKitProvider } from "@ciwallet-sdk/providers"
import { ChainId } from "@ciwallet-sdk/types"

function App() {
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
            <Provider store={store}>
                <HookProvider>  
                    <HeroUIProvider>
                        <div className="max-w-[500px] my-6 mx-auto">
                            <Nomas />
                            <UI />
                        </div>
                    </HeroUIProvider>
                </HookProvider>
            </Provider>
        </WalletKitProvider>
    )
}

export default App
