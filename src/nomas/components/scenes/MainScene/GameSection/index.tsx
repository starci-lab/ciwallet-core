import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../../extends"
import { assetsConfig } from "@/nomas/resources"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ReactShopModal } from "@/nomas/game/ui/modal/ReactShopModal"
import type { GameScene } from "@/nomas/game/GameScene"

export const GameSection = () => {
    const assets = assetsConfig().app
    const [isMinimized, setIsMinimized] = useState(false)
    const [showShop, setShowShop] = useState(false)

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
                                onClick={handleMinimizeToggle}
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
                ) : (
                /* Shop UI - Replace NomasCardBody content */
                    <ReactShopModal
                        isOpen={showShop}
                        onClose={() => setShowShop(false)}
                        scene={null as unknown as GameScene} // Mock scene for demo
                    />
                )}
            </NomasCardBody>
        </NomasCard>
    )
}
