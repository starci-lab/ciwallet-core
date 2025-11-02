import React, { useMemo } from "react"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardVariant } from "@/nomas/components"
import { NomasImage } from "@/nomas/components"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { motion } from "framer-motion"
import { assetsConfig } from "@/nomas/resources"
import {
  useGameLoadSwrMutation,
  useShopEventsCore,
  useHomeEventsCore,
} from "@/nomas/hooks"
import { LoadingSection } from "./LoadingSection"

export const GameSplashPage = () => {
  const assets = assetsConfig().app
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
  const swrMutation = useGameLoadSwrMutation()
  const { openShop } = useShopEventsCore()
  const { openHome } = useHomeEventsCore()
  if (!account) throw new Error("Account not found")
  return (
    <>
      <NomasCard variant={NomasCardVariant.Gradient} isContainer>
        <NomasCardBody className="relative w-full">
          {swrMutation.isMutating ? (
            <LoadingSection />
          ) : (
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
              {/* Test Buttons - Only show when game is loaded */}
              {gameLoaded && (
                <>
                  <motion.button
                    initial={false}
                    whileTap={{ scale: 0.92, y: 4 }}
                    className="absolute left-0 right-0 bottom-[80px] mx-auto w-[200px] cursor-pointer"
                    style={{ position: "absolute" }}
                    onClick={openHome}
                  >
                    <div className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      🏠 Test Home
                    </div>
                  </motion.button>
                  <motion.button
                    initial={false}
                    whileTap={{ scale: 0.92, y: 4 }}
                    className="absolute left-0 right-0 bottom-[120px] mx-auto w-[200px] cursor-pointer"
                    style={{ position: "absolute" }}
                    onClick={openShop}
                  >
                    <div className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      🛒 Test Shop
                    </div>
                  </motion.button>
                </>
              )}
              {/* Start Game Button - Only show when game is NOT loaded */}
              {!gameLoaded && (
                <motion.button
                  initial={false}
                  whileTap={{ scale: 0.92, y: 4 }}
                  className="absolute left-0 right-0 bottom-[40px] mx-auto w-[200px] cursor-pointer"
                  style={{ position: "absolute" }}
                  onClick={async () => {
                    await swrMutation.trigger()
                  }}
                >
                  <NomasImage
                    src={assetsConfig().app.petRisingGameButton}
                    alt="Start Game"
                    className="w-full h-auto object-contain select-none"
                  />
                </motion.button>
              )}
            </>
          )}
        </NomasCardBody>
      </NomasCard>
    </>
  )
}
