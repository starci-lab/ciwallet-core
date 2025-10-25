import { SingletonHookProvider } from "./hooks"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import { ReduxProvider, selectSelectedAccountByPlatform, useAppSelector } from "./redux"
import { IconContext } from "@phosphor-icons/react"
import { Scene } from "@/nomas/redux"
import "./global.css"
import { InitScene, MainScene, MyWalletsScene, SettingsScene } from "@/nomas/components"
import { GameComponent } from "@/nomas/game/GameScene/index"
import { Wallet } from "ethers"
import { motion } from "framer-motion"
import { WalletKitProvider } from "@ciwallet-sdk/providers"

export const Nomas = () => {
    return (
        <WalletKitProvider context={{
            adapter: {
                chains: [
                    {
                        chainId: ChainId.Monad,
                        rpcs: ["https://testnet-rpc.monad.xyz"],
                    },
                ],
            }
        }}>
            <ReduxProvider>
                <SingletonHookProvider>
                    <IconContext.Provider
                        value={{
                            className: "h-5 w-5",
                        }}
                    >
                        <div className="font-sans w-full h-full relative text">
                            <NomasContent />
                        </div>
                    </IconContext.Provider>
                </SingletonHookProvider>
            </ReduxProvider>
        </WalletKitProvider>
    )
}

const NomasContent = () => {
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const scene = useAppSelector((state) => state.stateless.scene.scene)
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    const renderContent = () => {
        switch (scene) {
        case Scene.Init:
            return <InitScene />
        case Scene.Main:
            return <MainScene />
        case Scene.Settings:
            return <SettingsScene />
        case Scene.MyWallets:
            return <MyWalletsScene />
        }
    }
    return <>
        <motion.div
            drag
            dragMomentum={false}
            className="absolute top-10 max-w-[500px] left-10 pointer-events-auto scale-[0.8] origin-top-center max-h-[500px] w-auto overflow-auto radius-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
            {renderContent()}
        </motion.div>
        {
            initialized && (
                <div className="fixed bottom-0 left-0 w-full z-50">
                    <GameComponent
                        signMessage={async (message) => {
                            if (!selectedAccount?.privateKey) 
                                throw new Error("Selected account private key not found")
                            const wallet = new Wallet(selectedAccount?.privateKey)
                            return await wallet.signMessage(message)
                        }}
                        publicKey={selectedAccount?.accountAddress || ""}
                    />
                </div>
            )}
    </>
}
