
import { SingletonHookProvider } from "@/nomas/hooks/singleton"
import { store } from "@/nomas/redux"
import { UI } from "@/nomas/ui"
import { TransactionProvider, WalletKitProvider } from "@ciwallet-sdk/providers"
import { ChainId } from "@ciwallet-sdk/types"
import { HeroUIProvider } from "@heroui/react"
import { IconContext } from "@phosphor-icons/react"
import { ethers } from "ethers"
import { Provider } from "react-redux"
import { signTransaction } from "./adapter"
import { Nomas } from "./nomas"

function App() {
    return (
        <WalletKitProvider
            context={{
                adapter: {
                    signAndSendTransaction: async ({ chainId, network, transaction }) => {
                        console.log(chainId, network, transaction)
                        const provider = new ethers.JsonRpcProvider(
                            "https://testnet-rpc.monad.xyz",
                        )
                        const privateKey =
              "88a07f6c444b42996ecf6f365c9f7c98029a0b8c02d4ad1b5462c4386ab9c309"
                        const signer = new ethers.Wallet(privateKey, provider)
                        const decoded = ethers.Transaction.from(transaction)
                        const { hash } = await signer.sendTransaction(decoded)
                        const rx = await provider.waitForTransaction(hash)

                        console.log("tx::", rx)

                        return {
                            signature: hash,
                            fee: rx?.fee,
                        }
                    },
                    signTransaction,
                    aggregators: {
                        ciAggregator: {
                            url: "http://localhost:3000",
                        },
                    },
                    chains: [
                        {
                            chainId: ChainId.Monad,
                            rpcs: ["https://testnet-rpc.monad.xyz"],
                        },
                        {
                            chainId: ChainId.Solana,
                            rpcs: ["https://api.devnet.solana.com"],
                        },
                    ],
                },
            }}
        >
            <TransactionProvider
                context={{
                    adapter: {
                        saveTransaction: async ({
                            txHash,
                            status,
                            network,
                            chainId,
                            type,
                        }) => {
                            const transaction = {
                                txHash,
                                status,
                                network,
                                chainId,
                                type,
                            }
                            localStorage.setItem(
                                `${network}-${chainId}-${type}`,
                                JSON.stringify(transaction),
                            )
                        },
                        getTransactions: async ({ network, chainId, filter }) => {
                            const transactions = localStorage.getItem(
                                `${network}-${chainId}-${filter}`,
                            )
                            return {
                                transactions: transactions ? JSON.parse(transactions) : [],
                                nextCursor: "",
                            }
                        },
                    },
                }}
            >
                <Provider store={store}>
                    <SingletonHookProvider>
                        <IconContext.Provider
                            value={{
                                className: "h-5 w-5",
                            }}
                        >
                            <HeroUIProvider>
                                <div className="max-w-[500px] my-6 mx-auto font-sans text-foreground">
                                    <Nomas />
                                    <UI />
                                </div>
                            </HeroUIProvider>
                        </IconContext.Provider>
                    </SingletonHookProvider>
                </Provider>
            </TransactionProvider>
        </WalletKitProvider>
    )
}

export default App
