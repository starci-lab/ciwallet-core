import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../../extends"
import { assetsConfig } from "@/nomas/resources"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export const GameSection = () => {
    const assets = assetsConfig().app
    const [isMinimized, setIsMinimized] = useState(false)

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
                {/* Button (bottom) */}
                <button
                    onClick={handleMinimizeToggle}
                    className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 
                        w-48 h-auto cursor-pointer 
                        transition-all duration-300 hover:scale-105 
                        focus:outline-none active:scale-95
                        ${isMinimized ? "opacity-50" : "opacity-100"}`}
                    title={isMinimized ? "Restore Game" : "Minimize Game"}
                >
                    <NomasImage
                        src={assets.petRisingGameButton}
                        alt={isMinimized ? "Restore Game" : "Minimize Game"}
                        className="w-full h-auto object-contain select-none"
                    />
                </button>
            </NomasCardBody>
        </NomasCard>
    )
}
