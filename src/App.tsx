import React from "react"
import { Nomas } from "./nomas"
import { HeroUIProvider } from "@heroui/react"
import { Provider } from "react-redux"
import { store } from "@/nomas/redux"
import { HookProvider } from "@/nomas/hooks"
import { UI } from "@/nomas/ui"
import { WalletKitProvider } from "@ciwallet-sdk/providers"
import { ChainId } from "@ciwallet-sdk/types"
import { IconContext } from "@phosphor-icons/react"


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
                    <IconContext.Provider value={{
                        className: "h-5 w-5"
                    }}> 
                        <HeroUIProvider>
                            <div className="max-w-[500px] my-6 mx-auto font-sans text-foreground">
                                <Nomas />
                                <UI />
                            </div>
                        </HeroUIProvider>
                    </IconContext.Provider>
                </HookProvider>
            </Provider>
        </WalletKitProvider>
    )
}

export default App
