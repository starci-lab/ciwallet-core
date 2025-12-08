import { SingletonHookProvider } from "./hooks"
import { ReduxProvider, setPosX, setPosY, useAppDispatch, useAppSelector } from "./redux"
import { IconContext } from "@phosphor-icons/react"
import { Scene } from "@/nomas/redux"
import "./global.css"
import { InitScene, MainScene, MyWalletsScene, SettingsScene, CopyAddressScene, Workers } from "@/nomas/components"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import { twMerge } from "tailwind-merge"
import { CONTAINER_ID } from "@/nomas/game"
import { NomasToaster } from "@/nomas/components"
import { EventEmitter } from "eventemitter3"
import { useContentBus } from "./hooks"
import { AnimatePresence } from "framer-motion"
import { SWRConfig } from "swr"
import { useEffect } from "react"
import Decimal from "decimal.js"
import { X } from "lucide-react"

export interface NomasProps {
    contentEventBus?: EventEmitter
}
export const Nomas = ({ contentEventBus }: NomasProps) => {
    return (
        <ReduxProvider loading={<></>}>
            <SWRConfig
                value={{
                    provider: () => new Map()
                }}
            >
                <SingletonHookProvider>
                    <IconContext.Provider
                        value={{
                            className: "h-5 w-5"
                        }}
                    >
                        <div className="font-sans w-full h-full relative text-text">
                            <NomasContent contentEventBus={contentEventBus} />
                        </div>
                    </IconContext.Provider>
                </SingletonHookProvider>
            </SWRConfig>
        </ReduxProvider>
    )
}

export const NomasContent = ({ contentEventBus }: NomasProps) => {
    const scene = useAppSelector((state) => state.stateless.scene.scene)
    const draggable = useAppSelector((state) => state.stateless.scene.draggable)
    const isGameMinimized = useAppSelector((state) => state.persists.session.isGameMinimized)
    const triggerAnchoredKey = useAppSelector((state) => state.persists.session.triggerAnchoredKey)
    const gameLoaded = useAppSelector((state) => state.stateless.game.gameLoaded)
    const isOverlayVisible = useAppSelector((state) => state.persists.session.isOverlayVisible)
    const dispatch = useAppDispatch()
    const defaultPosX = -100
    const defaultPosY = 50
    // drag controls
    const controls = useDragControls()
    // Redux states
    const posX = useAppSelector((state) => state.persists.session.posX)
    const posY = useAppSelector((state) => state.persists.session.posY)
    // Motion values bound to transform
    // Khi triggerAnchoredKey đổi → reset vị trí
    useEffect(() => {}, [posX, posY])
    // Khi Redux posX/posY thay đổi → sync vào motionValue
    useEffect(() => {
        dispatch(setPosX(defaultPosX))
        dispatch(setPosY(defaultPosY))
    }, [triggerAnchoredKey])

    // Scene switching
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

    // Listen to inter-tab content bus
    useContentBus(contentEventBus)
    return (
        <>
            <Workers />
            <AnimatePresence>
                {isOverlayVisible && (
                    <motion.div
                        key="nomas-overlay"
                        drag={draggable}
                        dragControls={controls}
                        onPointerDown={(event) => controls.start(event)}
                        dragListener={false}
                        dragMomentum={false}
                        style={{ scale: 0.75, touchAction: "none" }}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        transition={{ type: "spring", damping: 20, stiffness: 120 }}
                        className="
                            absolute
                            pointer-events-auto
                            origin-top-center
                            hide-scrollbar
                            will-change-transform
                            w-[500px]
                            max-h-[750px]
                            overflow-y-auto
                            rounded-card
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:'none']
                            [scrollbar-width:'none']
                            overflow-x-hidden
                        "
                    >
                        {renderContent()}
                        <NomasToaster />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom game container */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isGameMinimized ? "100%" : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20
                }}
                className={twMerge(
                    "fixed bottom-0 left-0 w-screen z-[9999] border-none bg-transparent pointer-events-auto isolate",
                    "h-[140px]",
                    !gameLoaded && "pointer-events-none"
                )}
            >
                <div id={CONTAINER_ID} className="w-full h-full bg-transparent" />
            </motion.div>
        </>
    )
}
