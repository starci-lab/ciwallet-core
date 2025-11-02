import { SingletonHookProvider } from "./hooks"
import { ChainId } from "@ciwallet-sdk/types"
import { ReduxProvider, useAppSelector } from "./redux"
import { IconContext } from "@phosphor-icons/react"
import { Scene } from "@/nomas/redux"
import "./global.css"
import {
    InitScene,
    MainScene,
    MyWalletsScene,
    SettingsScene,
    CopyAddressScene,
    Workers,
} from "@/nomas/components"
import { motion } from "framer-motion"
import { WalletKitProvider } from "@ciwallet-sdk/providers"
import { twMerge } from "tailwind-merge"
import { CONTAINER_ID } from "@/nomas/game"
import { NomasToaster } from "@/nomas/components"

export const Nomas = () => {
    return (
        <WalletKitProvider
            context={{
                adapter: {
                    chains: [
                        {
                            chainId: ChainId.Monad,
                            rpcs: ["https://testnet-rpc.monad.xyz"],
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
    const scene = useAppSelector((state) => state.stateless.scene.scene)
    const isGameMinimized = useAppSelector(
        (state) => state.persists.session.isGameMinimized
    )
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
        case Scene.CopyAddress:
            return <CopyAddressScene />
        }
    }
    return (
        <>
            {/* workers */}
            <Workers />
            <motion.div
                drag
                dragMomentum={false}
                className="absolute top-10 max-w-[600px] left-10 pointer-events-auto scale-[0.8] origin-top-center max-h-[800px] w-auto overflow-auto radius-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
                {renderContent()}
                <NomasToaster />
            </motion.div>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isGameMinimized ? "100%" : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                }}
                className={twMerge(
                    "fixed bottom-0 left-0 w-screen z-[9999] border-none bg-transparent pointer-events-auto isolate",
                    "h-[140px]"
                )}
            >
                <div id={CONTAINER_ID} className="w-full h-full bg-transparent"></div>
            </motion.div>
        </>
    )
}
