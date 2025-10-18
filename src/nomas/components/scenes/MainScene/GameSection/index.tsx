import {
    NomasCard,
    NomasCardBody,
    NomasCardVariant,
    NomasImage,
} from "../../../extends"
import { assetsConfig } from "@/nomas/resources"
import { motion } from "framer-motion"

export const GameSection = () => {
    const assets = assetsConfig().app

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
                    onClick={() => console.log("Start game!")}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 
               w-48 h-auto cursor-pointer 
               transition-transform hover:scale-105 
               focus:outline-none active:scale-95"
                >
                    <NomasImage
                        src={assets.petRisingGameButton}
                        alt="Play Button"
                        className="w-full h-auto object-contain select-none"
                    />
                </button>
            </NomasCardBody>
        </NomasCard>
    )
}
