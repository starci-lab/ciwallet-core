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
import { EventEmitter } from "eventemitter3"
import { useContentBus } from "./hooks"
import { AnimatePresence } from "framer-motion"

export interface NomasProps {
    contentEventBus?: EventEmitter
}
export const Nomas = ({ contentEventBus }: NomasProps) => {
    
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
                        <div className="font-sans w-full h-full relative text-text">
                            <NomasContent contentEventBus={contentEventBus} />
                        </div>
                    </IconContext.Provider>
                </SingletonHookProvider>
            </ReduxProvider>
        </WalletKitProvider>
    )
}

const NomasContent = ({ contentEventBus }: NomasProps) => {
    const scene = useAppSelector((state) => state.stateless.scene.scene)
    const isGameMinimized = useAppSelector(
        (state) => state.persists.session.isGameMinimized
    )
    const gameLoaded = useAppSelector((state) => state.stateless.game.gameLoaded)
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

    // a hook to listen to content events
    useContentBus(contentEventBus)
    const isOverlayVisible = useAppSelector((state) => state.persists.session.isOverlayVisible)
    return (
        <>
            {/* workers */}
            <Workers />
            <AnimatePresence>
                {isOverlayVisible && (
                    <motion.div
                        key="nomas-overlay"
                        drag
                        dragMomentum={false}
                        initial={{ opacity: 0, x: 100 }}       
                        animate={{ opacity: 1, x: 0 }}          
                        exit={{ opacity: 0, x: 200 }} 
                        transition={{ type: "spring", damping: 20, stiffness: 120 }}
                        className="absolute top-10 w-[500px] h-[600px] left-10 pointer-events-auto origin-top-center left-10 pointer-events-auto origin-top-center w-auto overflow-autorounded-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {renderContent()}
                        <NomasToaster />
                    </motion.div>
                )}
            </AnimatePresence>
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
                    "h-[140px]",
                    !gameLoaded && "pointer-events-none"
                )}
            >
                <div id={CONTAINER_ID} className="w-full h-full bg-transparent"></div>
            </motion.div>
        </>
    )
}
