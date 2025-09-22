import React from "react"
import { Nomas } from "./nomas"
import { HeroUIProvider } from "@heroui/react"
import { Provider } from "react-redux"
import { store } from "@/nomas/redux"
import { SingletonHookProvider } from "@/nomas/hooks/singleton"
import { UI } from "@/nomas/ui"
import { WalletKitProvider } from "@ciwallet-sdk/providers"
import { ChainId } from "@ciwallet-sdk/types"
import { IconContext } from "@phosphor-icons/react"
import { ethers } from "ethers"


function App() {
    return (
        <WalletKitProvider context={{
            adapter: {
                signAndSendTransaction: async ({ 
                    chainId, 
                    network, 
                    transaction 
                }) => {
                    console.log(chainId, network, transaction)
                    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz")
                    const privateKey = "88a07f6c444b42996ecf6f365c9f7c98029a0b8c02d4ad1b5462c4386ab9c309"
                    const signer = new ethers.Wallet(privateKey, provider)
                    const decoded = ethers.Transaction.from(transaction)
                    const { hash } = await signer.sendTransaction(decoded)
                    await provider.waitForTransaction(hash)
                    return {
                        signature: hash
                    }
                },
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
                <SingletonHookProvider>  
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
                </SingletonHookProvider>
            </Provider>
        </WalletKitProvider>
    )
}

export default App
