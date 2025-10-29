import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../../extends"
import { assetsConfig } from "@/nomas/resources"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { ReactShopModal } from "@/nomas/game/ui/modal/ReactShopModal"
import type { GameScene } from "@/nomas/game/GameScene"
import { useColyseus, useGameAuthenticationSwrMutation } from "@/nomas/hooks"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import { usePhaser } from "@/nomas/hooks"
import { SceneName } from "@/nomas/game/types"

export const GameSection = () => {
    const assets = assetsConfig().app
    const gameRef = useRef<Phaser.Game | null>(null)
    const [isMinimized, setIsMinimized] = useState(false)
    const [showShop, setShowShop] = useState(false)
    const [gameScene, setGameScene] = useState<GameScene | null>(null)
    const { createGame } = usePhaser()

    const handleMinimizeToggle = () => {
        const minimizeEvent = new CustomEvent("toggleGameMinimize", {
            detail: { isMinimized },
        })
        window.dispatchEvent(minimizeEvent)

        // Toggle local state
        setIsMinimized(!isMinimized)

        console.log(`🎮 Game ${!isMinimized ? "minimized" : "restored"}`)
    }

    // Lắng nghe event từ GameComponent để sync state
    useEffect(() => {
        const handleGameMinimizeState = (event: CustomEvent) => {
            setIsMinimized(event.detail.isMinimized)
        }

        window.addEventListener(
            "gameMinimizeStateChanged",
      handleGameMinimizeState as EventListener
        )

        return () => {
            window.removeEventListener(
                "gameMinimizeStateChanged",
        handleGameMinimizeState as EventListener
            )
        }
    }, [])

    // Get the game scene instance from Phaser (similar to GameComponent)
    useEffect(() => {
        const getGameScene = () => {
            // Try to get the Phaser game instance from the global window object
            const phaserGame = gameRef.current
            if (phaserGame) {
                const scene = phaserGame.scene.getScene(SceneName.Gameplay) as GameScene
                if (scene) {
                    console.log("✅ GameScene found and connected to GameSection")
                    setGameScene(scene)
                    return true
                }
            }
            // Fallback: try to find the game container and get the scene
            const gameContainer = document.getElementById("phaser-container")
            if (gameContainer) {
                const phaserInstance = gameRef.current
                if (phaserInstance) {
                    const scene = phaserInstance.scene.getScene(
                        SceneName.Gameplay
                    ) as GameScene
                    if (scene) {
                        console.log(
                            "✅ GameScene found via container and connected to GameSection"
                        )
                        setGameScene(scene)
                        return true
                    }
                }
            }

            return false
        }

        // Try immediately
        if (!getGameScene()) {
            // If not found, try periodically until found (similar to GameComponent polling)
            const intervalId = setInterval(() => {
                if (getGameScene()) {
                    clearInterval(intervalId)
                }
            }, 200) // Same interval as GameComponent

            // Clean up after 6 seconds (30 attempts * 200ms)
            const timeoutId = setTimeout(() => {
                clearInterval(intervalId)
                console.log("⚠️ GameScene not found after 6 seconds")
            }, 6000)

            return () => {
                clearInterval(intervalId)
                clearTimeout(timeoutId)
            }
        }
    }, [])

    // Note: We don't need to listen for external shop events since we're using local shop UI
    const { joinOrCreateRoom } = useColyseus()
    const swrMutation = useGameAuthenticationSwrMutation()
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    return (
        <NomasCard variant={NomasCardVariant.Gradient}>
            <NomasCardBody className="relative w-full">
                {!showShop ? (
                    <>
                        {/* Background */}
                        <NomasImage
                            src={assets.petRisingGameBackground}
                            alt="Pet Rising Game Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Logo (bounce using Framer Motion) */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-[40%]"
                            animate={{ y: [0, -15, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <NomasImage
                                src={assets.petRisingGameLogo}
                                alt="Pet Rising Game Logo"
                                className="h-fit w-full object-contain"
                            />
                        </motion.div>
                        {/* Buttons (bottom) */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-4">
                            {/* Play/Minimize Button */}
                            <button
                                onClick={
                                    async () => {
                                        // authenticate the user
                                        await swrMutation.trigger()
                                        // join or create the room
                                        await joinOrCreateRoom(
                                            `pet-game-monad-${selectedAccount?.accountAddress}-${network}`,
                                            {
                                                // todo: add token to the room
                                            }
                                        )
                                        // thus, we create the game
                                        createGame()
                                    }
                                }
                                className={`w-48 h-auto cursor-pointer 
                                            transition-all duration-300 hover:scale-105 
                                            focus:outline-none active:scale-95
                                            ${
                    isMinimized
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                                title={isMinimized ? "Restore Game" : "Minimize Game"}
                            >
                                <NomasImage
                                    src={assets.petRisingGameButton}
                                    alt={isMinimized ? "Restore Game" : "Minimize Game"}
                                    className="w-full h-auto object-contain select-none"
                                />
                            </button>

                            {/* Shop Button */}
                            <button
                                onClick={() => setShowShop(true)}
                                className="w-16 h-16 bg-gradient-to-b from-[#1D1D1D] to-[#141414] 
                                           rounded-full border-[3px] border-[rgba(135,135,135,0.7)]
                                           shadow-[0px_6px_20px_rgba(0,0,0,0.6),inset_0px_2px_4px_rgba(255,255,255,0.1)]
                                           cursor-pointer flex items-center justify-center text-2xl
                                           text-[#B3B3B3] transition-all duration-300 ease-in-out
                                           hover:scale-110 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.8),inset_0px_2px_4px_rgba(255,255,255,0.2)]
                                           hover:border-[rgba(135,135,135,1)] hover:text-white"
                                title="Open Shop"
                            >
                🛒
                            </button>
                        </div>
                    </>
                ) : /* Shop UI - Replace NomasCardBody content */
                    gameScene ? (
                        <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden">
                            {/* Shop Content - Render ReactShopModal content directly */}
                            <div className="h-full overflow-hidden">
                                <ReactShopModal
                                    isOpen={showShop}
                                    onClose={() => setShowShop(false)}
                                    scene={gameScene}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden flex items-center justify-center">
                            <div className="text-center text-white">
                                <h3 className="text-xl font-semibold mb-4">
                Loading Game Scene...
                                </h3>
                                <p className="text-gray-400">
                Please wait while the game initializes
                                </p>
                                <div className="mt-4">
                                    <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    )}
            </NomasCardBody>
        </NomasCard>
    )
}
