/* eslint-disable indent */
import { useMemo } from "react"
import {
  selectSelectedAccountByPlatform,
  useAppSelector,
  useAppDispatch,
  setIsGameMinimized,
} from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardVariant } from "@/nomas/components"
import { NomasImage } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { motion, AnimatePresence } from "framer-motion"
import { assetsConfig } from "@/nomas/resources"
import {
  useGameLoadSwrMutation,
  useShopEventsCore,
  useHomeEventsCore,
} from "@/nomas/hooks"
import { LoadingSection } from "./LoadingSection"

export const GameSplashPage = () => {
  const assets = assetsConfig().app
  const dispatch = useAppDispatch()
  const depositSelectedChainId = useAppSelector(
    (state) => state.stateless.sections.home.depositSelectedChainId
  )
  const platform = useMemo(() => {
    return chainIdToPlatform(depositSelectedChainId)
  }, [depositSelectedChainId])
  const account = useAppSelector((state) =>
    selectSelectedAccountByPlatform(state.persists, platform)
  )
  const gameLoaded = useAppSelector((state) => state.stateless.game.gameLoaded)
  const isGameMinimized = useAppSelector(
    (state) => state.persists.session.isGameMinimized
  )
  const swrMutation = useGameLoadSwrMutation()
  const { openShop } = useShopEventsCore()
  const { openHome } = useHomeEventsCore()

  const handleToggleGame = () => {
    dispatch(setIsGameMinimized(!isGameMinimized))
  }

  if (!account) throw new Error("Account not found")

  return (
    <NomasCard variant={NomasCardVariant.Gradient} isContainer>
      <NomasCardBody className="relative w-full min-h-[500px]">
        {swrMutation.isMutating ? (
          <LoadingSection />
        ) : (
          <>
            {/* Background with subtle animation */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-card-dark/80 via-transparent to-transparent" />
            </motion.div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-accent-purple/40"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Logo with enhanced animation */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[65%] z-10"
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              animate={{
                y: [0, -20, 0],
                opacity: 1,
                scale: 1,
              }}
              transition={{
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
              }}
            >
              <NomasImage
                src={assets.petRisingGameLogo}
                alt="Pet Rising Game Logo"
                className="h-fit w-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Action Buttons */}
            <div className="absolute left-0 right-0 bottom-[50px] mx-auto w-fit z-10">
              {!gameLoaded ? (
                // Start Game Button
                <motion.div
                  className="w-[280px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92, y: 3 }}
                    className="relative w-full cursor-pointer group"
                    onClick={async () => {
                      await swrMutation.trigger()
                    }}
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-button blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "var(--accent-purple)" }}
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Button image */}
                    <div className="relative">
                      <NomasImage
                        src={assetsConfig().app.petRisingGameButton}
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
                      ease: "easeInOut",
                    }}
                  >
                    Click to start your adventure
                  </motion.p>
                </motion.div>
              ) : (
                // Game Controls when loaded
                <div className="relative flex items-center justify-center">
                  {/* Side Buttons - Home & Shop - Only show when game is visible */}
                  <AnimatePresence>
                    {!isGameMinimized && (
                      <>
                        {/* Home Button - Left */}
                        <motion.button
                          initial={{ x: 50, opacity: 0, scale: 0.3 }}
                          animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            x: 50,
                            opacity: 0,
                            scale: 0.3,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                            delay: 0.05,
                          }}
                          whileHover={{
                            scale: 1.15,
                            y: -8,
                            rotate: -5,
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={openHome}
                          className="absolute right-full top-4/5 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-purple to-accent-purple backdrop-blur-md border-2 border-text/30 shadow-2xl flex flex-col items-center justify-center gap-1 group overflow-hidden"
                        >
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "200%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          />
                          <span className="text-4xl group-hover:scale-125 transition-transform relative z-10">
                            🏠
                          </span>
                          <span className="text-xs font-bold text relative z-10">
                            Home
                          </span>
                        </motion.button>

                        {/* Shop Button - Right */}
                        <motion.button
                          initial={{ x: -50, opacity: 0, scale: 0.3 }}
                          animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            x: -50,
                            opacity: 0,
                            scale: 0.3,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                            delay: 0.1,
                          }}
                          whileHover={{
                            scale: 1.15,
                            y: -8,
                            rotate: 5,
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={openShop}
                          className="absolute left-full top-4/5 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple via-accent-amber to-accent-amber backdrop-blur-md border-2 border-text/30 shadow-2xl flex flex-col items-center justify-center gap-1 group overflow-hidden"
                        >
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "200%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                              delay: 0.5,
                            }}
                          />
                          <span className="text-4xl group-hover:scale-125 transition-transform relative z-10">
                            🛒
                          </span>
                          <span className="text-xs font-bold text relative z-10">
                            Shop
                          </span>
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Center Play Button - Always visible, toggles game */}
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92, y: 3 }}
                    onClick={handleToggleGame}
                    className="relative w-[280px] cursor-pointer group z-10"
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-button blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "var(--accent-purple)" }}
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Button image */}
                    <div className="relative">
                      <NomasImage
                        src={assetsConfig().app.petRisingGameButton}
                        alt="Toggle Game"
                        className="w-full h-auto object-contain select-none drop-shadow-2xl"
                      />
                    </div>
                  </motion.button>
                </div>
              )}
            </div>
          </>
        )}
      </NomasCardBody>
    </NomasCard>
  )
}
