import { useMemo } from "react"
import { selectSelectedAccountByPlatform, useAppSelector, useAppDispatch, setIsGameMinimized } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardVariant, NomasInput } from "@/nomas/components"
import { NomasImage } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { motion } from "framer-motion"
import { assetsConfig } from "@/nomas/resources"
import { useGameLoadSwrMutation, useShopEventsCore, useHomeEventsCore } from "@/nomas/hooks"
import { LoadingSection } from "./LoadingSection"
import { PlayIcon, PauseIcon } from "@phosphor-icons/react"

export const GameSplashPage = () => {
    const assets = assetsConfig().app
    const gameAssets = assetsConfig().game
    const dispatch = useAppDispatch()
    const depositSelectedChainId = useAppSelector((state) => state.stateless.sections.home.depositSelectedChainId)
    const platform = useMemo(() => {
        return chainIdToPlatform(depositSelectedChainId)
    }, [depositSelectedChainId])
    const account = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, platform))
    const gameLoaded = useAppSelector((state) => state.stateless.game.gameLoaded)
    const isGameMinimized = useAppSelector((state) => state.persists.session.isGameMinimized)
    const balance = useAppSelector((state) => state.stateless.user.nomToken)
    const swrMutation = useGameLoadSwrMutation()
    const { openShop } = useShopEventsCore()
    const { openHome } = useHomeEventsCore()

    const handleToggleGame = () => {
        dispatch(setIsGameMinimized(!isGameMinimized))
    }

    if (!account) throw new Error("Account not found")

    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer>
            <NomasCardBody className="relative w-full min-h-[500px] p-2">
                {swrMutation.isMutating ? (
                    <LoadingSection />
                ) : (
                    <>
                        {/* Background with subtle animation - Only show when game not loaded */}
                        {!gameLoaded && (
                            <>
                                <motion.div
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    <NomasImage
                                        src={assets.petRisingGameBackground}
                                        alt="Pet Rising Game Background"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient overlay for better contrast */}
                                    <div className="absolute inset-0 bg-linear-to-t from-card-dark/80 via-transparent to-transparent" />
                                </motion.div>

                                {/* Floating particles effect */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-3 h-3 rounded-full"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                                backgroundColor: "var(--accent-purple)",
                                                opacity: 0.4
                                            }}
                                            animate={{
                                                y: [0, -40, 0],
                                                opacity: [0.3, 0.7, 0.3],
                                                scale: [1, 1.5, 1]
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 2,
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Portal Content */}
                        <div className="relative z-10 w-full h-full flex flex-col">
                            {!gameLoaded ? (
                                // Pre-loading state: Logo + Start Button
                                <>
                                    {/* Logo with enhanced animation */}
                                    <motion.div
                                        className="flex-1 flex items-center justify-center"
                                        initial={{ y: -50, opacity: 0, scale: 0.8 }}
                                        animate={{
                                            y: [0, -20, 0],
                                            opacity: 1,
                                            scale: 1
                                        }}
                                        transition={{
                                            y: {
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            },
                                            opacity: { duration: 0.8 },
                                            scale: { duration: 0.8 }
                                        }}
                                    >
                                        <div className="w-[65%] max-w-[400px]">
                                            <NomasImage
                                                src={assets.petRisingGameLogo}
                                                alt="Pet Rising Game Logo"
                                                className="h-fit w-full object-contain drop-shadow-2xl"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Start Game Button */}
                                    <motion.div
                                        className="pb-12 flex flex-col items-center"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.92, y: 3 }}
                                            className="relative w-[280px] cursor-pointer group"
                                            onClick={async () => {
                                                await swrMutation.trigger()
                                            }}
                                        >
                                            {/* Glow effect */}
                                            <motion.div
                                                className="absolute inset-0 rounded-button blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                                                style={{ backgroundColor: "var(--accent-purple)" }}
                                                animate={{
                                                    scale: [1, 1.15, 1]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />

                                            {/* Button image */}
                                            <div className="relative">
                                                <NomasImage
                                                    src={assets.petRisingGameButton}
                                                    alt="Start Game"
                                                    className="w-full h-auto object-contain select-none drop-shadow-2xl"
                                                />
                                            </div>
                                        </motion.button>

                                        {/* Hint text */}
                                        <motion.p
                                            className="text-center text-muted text-sm mt-4 font-medium"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            Click to start your adventure
                                        </motion.p>
                                    </motion.div>
                                </>
                            ) : (
                                // Game Portal Dashboard when loaded
                                <div className="flex flex-col h-full p-2 gap-2">
                                    {/* Header Section: Logo + Pause Button */}
                                    <motion.div
                                        className="flex items-center justify-between gap-4 z-20"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {/* Logo */}
                                        <div className="w-[200px] max-w-[30%]">
                                            <NomasImage
                                                src={assets.petRisingGameLogo}
                                                alt="Pet Rising Game Logo"
                                                className="h-fit w-full object-contain drop-shadow-lg"
                                            />
                                        </div>

                                        {/* Pause Button - Compact */}
                                        <motion.button
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleToggleGame}
                                            className="group relative rounded-card-inner p-3 border-2 shadow-card flex flex-col items-center justify-center gap-1 min-w-[80px]"
                                            style={{
                                                background:
                                                    "linear-gradient(to bottom right, var(--accent-purple), var(--accent-cyan))",
                                                borderColor: "var(--accent-purple)"
                                            }}
                                        >
                                            {/* Pulsing glow */}
                                            <motion.div
                                                className="absolute inset-0 rounded-card-inner blur-xl opacity-50"
                                                style={{ backgroundColor: "var(--accent-purple)" }}
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.5, 0.7, 0.5]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />

                                            {isGameMinimized ? (
                                                <PlayIcon
                                                    weight="fill"
                                                    className="relative z-10 w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <PauseIcon
                                                    weight="fill"
                                                    className="relative z-10 w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                                                />
                                            )}
                                            <span className="relative z-10 text-xs font-semibold text-white">
                                                {isGameMinimized ? "Play" : "Pause"}
                                            </span>
                                        </motion.button>
                                    </motion.div>

                                    {/* Building Container with Background */}
                                    <motion.div
                                        className="flex-1 relative rounded-card-inner overflow-hidden min-h-[400px]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        {/* Background Image */}
                                        <NomasImage
                                            src="/assets/game/building/bg-home.png"
                                            alt="Game Background"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {/* Balance Badge */}
                                        <div className="absolute top-3 left-3 z-30">
                                            <div className="w-38 max-w-45">
                                                <NomasInput
                                                    value={balance.toLocaleString()}
                                                    prefixIcon={
                                                        <NomasImage
                                                            src={gameAssets.nomasCoin}
                                                            alt="NOM"
                                                            className="w-4 h-4"
                                                        />
                                                    }
                                                    currency="NOM"
                                                    numericOnly
                                                    readOnly
                                                    className="bg-transparent border-none shadow-none w-full"
                                                />
                                            </div>
                                        </div>

                                        {/* Home Building - Slightly right and down from center */}
                                        <motion.button
                                            onClick={openHome}
                                            className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                                        >
                                            <NomasImage
                                                src="/assets/game/building/home.png"
                                                alt="Home Building"
                                                className="w-auto h-[200px] md:h-[250px] object-contain drop-shadow-2xl"
                                            />
                                        </motion.button>

                                        {/* Shop Building - Bottom Right */}
                                        <motion.button
                                            onClick={openShop}
                                            className="absolute bottom-2 right-4 cursor-pointer z-20"
                                        >
                                            <NomasImage
                                                src="/assets/game/building/shop.png"
                                                alt="Shop Building"
                                                className="w-auto h-[120px] md:h-[150px] object-contain drop-shadow-2xl"
                                            />
                                        </motion.button>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </NomasCardBody>
        </NomasCard>
    )
}
