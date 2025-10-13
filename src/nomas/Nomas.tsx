import { WalletKitProvider } from "@ciwallet-sdk/providers"
import { SingletonHookProvider } from "./hooks"
import { ChainId } from "@ciwallet-sdk/types"
import { signTransaction } from "@/adapter"
import { ReduxProvider, selectSelectedAccount, useAppSelector } from "./redux"
import { IconContext } from "@phosphor-icons/react"
import { Scene } from "@/nomas/redux"
import "./global.css"
import { InitScene, MainScene } from "@/nomas/components"
import { GameComponent } from "@/nomas/game/GameScene/index"
import { encryptionObj } from "./obj"
import { Wallet, ethers } from "ethers"
export const Nomas = () => {
    return (
        <WalletKitProvider
            context={{
                adapter: {
                    signAndSendTransaction: async ({ chainId, network, transaction }) => {
                        console.log(chainId, network, transaction)
                        const provider = new ethers.JsonRpcProvider(
                            "https://testnet-rpc.monad.xyz"
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
            <ReduxProvider>
                <SingletonHookProvider>
                    <IconContext.Provider
                        value={{
                            className: "h-5 w-5",
                        }}
                    >
                        <div className="max-w-[500px] my-6 mx-auto font-sans text-foreground">
                            <NomasContent />
                        </div>
                    </IconContext.Provider>
                </SingletonHookProvider>
            </ReduxProvider>
        </WalletKitProvider>
    )
}

const NomasContent = () => {
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    const selectedAccount = useAppSelector((state) => selectSelectedAccount(state.persists))
    const password = useAppSelector((state) => state.persists.session.password)
    const scene = useAppSelector((state) => state.stateless.scene.scene)
    const renderContent = () => {
        switch (scene) {
        case Scene.Init:
            return <InitScene />
        case Scene.Main:
            return <MainScene />
        }
    }
    return <>
        {renderContent()}
        {
            chainId === ChainId.Monad && (
                <GameComponent
                    signMessage={
                        async (message) => {
                            const privateKey = await encryptionObj.decrypt(
                                selectedAccount?.encryptedPrivateKey || "",
                                password
                            )
                            const wallet = new Wallet(privateKey)
                            return await wallet.signMessage(message)
                        }}
                    publicKey={selectedAccount?.accountAddress || ""}
                />
            )
        }    
    </>
}
