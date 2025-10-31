/* eslint-disable indent */
import {
  NomasCard,
  NomasCardBody,
  NomasCardVariant,
  NomasImage,
} from "../../../extends"
import { assetsConfig } from "@/nomas/resources"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ReactShopModal } from "@/nomas/game/ui/react-ui/modal/ReactShopModal"
import type { GameScene } from "@/nomas/game/GameScene"
import { useColyseus, useGameAuthenticationSwrMutation } from "@/nomas/hooks"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import { usePhaser } from "@/nomas/hooks"
import { SceneName } from "@/nomas/game/types"
import { ReactHomeModal } from "@/nomas/game/ui/react-ui/modal/ReactHomeModal"
import { CONTAINER_ID } from "@/nomas/game/constants"

export const GameSection = () => {
  const assets = assetsConfig().app
  const containerRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [gameScene, setGameScene] = useState<GameScene | null>(null)
  const { createGame, game } = usePhaser()

  // Note: handleMinimizeToggle is kept for future use when game is minimized
  // const handleMinimizeToggle = () => {
  //   const minimizeEvent = new CustomEvent("toggleGameMinimize", {
  //     detail: { isMinimized },
  //   })
  //   window.dispatchEvent(minimizeEvent)

  //   // Toggle local state
  //   setIsMinimized(!isMinimized)

  //   console.log(`🎮 Game ${!isMinimized ? "minimized" : "restored"}`)
  // }

  // Listen for events from GameComponent to sync state
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

  useEffect(() => {
    if (!gameScene) return

    const handleOpenHome = () => {
      console.log("Opening home modal")
      setSelectedPetId(null)
      setShowHome(true)
    }

    const handleOpenHomeWithPet = (petId: string) => {
      console.log(" Opening home modal with pet:", petId)
      setSelectedPetId(petId)
      setShowHome(true)
    }

    gameScene.events.on("open-react-home", handleOpenHome)
    gameScene.events.on("open-react-home-with-pet", handleOpenHomeWithPet)
    return () => {
      gameScene.events.off("open-react-home", handleOpenHome)
      gameScene.events.off("open-react-home-with-pet", handleOpenHomeWithPet)
    }
  }, [gameScene])

  // Poll continuously until we have both game and scene
  useEffect(() => {
    // Skip if we already have both
    if (phaserGameRef.current && gameScene) {
      return
    }

    const checkGameAndScene = () => {
      // Try to get game from hook first, then ref, then global registry
      let phaserGame: Phaser.Game | null = game || phaserGameRef.current || null

      // If not in hook/ref, check global registry
      if (!phaserGame) {
        const container = document.getElementById(CONTAINER_ID)
        if (container?.querySelector("canvas")) {
          const phaserGames =
            (window as Window & { Phaser?: { GAMES?: Phaser.Game[] } }).Phaser
              ?.GAMES || []
          if (phaserGames.length > 0) {
            phaserGame = phaserGames[phaserGames.length - 1]
          }
        }
      }

      // If we have game, store it
      if (phaserGame && phaserGame !== phaserGameRef.current) {
        phaserGameRef.current = phaserGame
        console.log("✅ Phaser game instance found")
      }

      // Try to get scene
      if (phaserGame?.scene && !gameScene) {
        try {
          const scene = phaserGame.scene.getScene(
            SceneName.Gameplay
          ) as GameScene | null
          if (scene?.sys?.scene) {
            console.log("✅ GameScene found and connected to GameSection")
            setGameScene(scene)
            return true // Found scene, stop polling
          }
        } catch {
          // Scene not ready yet, continue polling
        }
      }

      return false // Continue polling
    }

    // Try immediately
    checkGameAndScene()

    // Poll every 200ms until we have scene
    const intervalId = setInterval(() => {
      if (checkGameAndScene()) {
        clearInterval(intervalId)
      }
    }, 200)

    // Clean up after 15 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (!gameScene) {
        console.log(
          "⚠️ GameScene not found after 15 seconds - game may still be loading"
        )
      }
    }, 15000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [game]) // Only depend on game from hook, not on internal states

  // Note: We don't need to listen for external shop events since we're using local shop UI
  const { joinOrCreateRoom } = useColyseus()
  const swrMutation = useGameAuthenticationSwrMutation()
  const _network = useAppSelector((state) => state.persists.session.network)
  const _selectedAccount = useAppSelector((state) =>
    selectSelectedAccountByPlatform(state.persists, Platform.Evm)
  )
  // Render game container directly to body using portal to avoid parent CSS interference
  const gameContainer = (
    <div
      className={`fixed bottom-0 left-0 w-screen z-[9999] border-none bg-transparent
                           transition-all duration-300 ease-in-out
                           ${
                             isMinimized
                               ? "h-[60px] translate-y-20"
                               : "h-[140px] translate-y-0"
                           }`}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        zIndex: 9999,
        pointerEvents: "auto",
        isolation: "isolate", // Create new stacking context
      }}
    >
      {/* Game Container - Direct child with CONTAINER_ID like GameComponent */}
      <div
        ref={containerRef}
        id={CONTAINER_ID}
        className="w-full h-full bg-transparent"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
          pointerEvents: "auto",
          overflow: "hidden",
          isolation: "isolate", // Ensure canvas is isolated from parent styles
        }}
      >
        {/* Ensure Phaser canvas is positioned correctly */}
        <style>{`
          #${CONTAINER_ID} {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
          }
          #${CONTAINER_ID} canvas {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            height: 100% !important;
            object-fit: contain !important; /* Changed from cover to contain */
            display: block !important;
          }
        `}</style>
      </div>
    </div>
  )

  return (
    <>
      {/* Render game container directly to body to avoid parent CSS interference */}
      {createPortal(gameContainer, document.body)}

      <NomasCard variant={NomasCardVariant.Gradient}>
        <NomasCardBody className="relative w-full">
          {/* Main UI: Show menu when shop/home are closed */}
          {!showShop && !showHome && (
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
                  onClick={async () => {
                    try {
                      // authenticate the user
                      await swrMutation.trigger()
                      // join or create the room
                      await joinOrCreateRoom(
                        // `pet-game-monad-${selectedAccount?.accountAddress}-${network}`,
                        "single_player",
                        {
                          // todo: add token to the room
                        }
                      )
                      // Ensure container exists before creating game
                      const container = document.getElementById(CONTAINER_ID)
                      if (!container) {
                        throw new Error(
                          "Game container not found. Please refresh the page."
                        )
                      }

                      // Log container position for debugging
                      const rect = container.getBoundingClientRect()
                      console.log("🎮 Container position:", {
                        id: CONTAINER_ID,
                        top: rect.top,
                        bottom: rect.bottom,
                        left: rect.left,
                        right: rect.right,
                        width: rect.width,
                        height: rect.height,
                        position: window.getComputedStyle(container).position,
                      })

                      // Create the game - this will mount Phaser to the container
                      createGame()
                      console.log(
                        "✅ Game creation initiated, waiting for Phaser to boot..."
                      )

                      // After a short delay, check if canvas was created
                      setTimeout(() => {
                        const canvas = container.querySelector("canvas")
                        if (canvas) {
                          const canvasRect = canvas.getBoundingClientRect()
                          console.log("🎮 Phaser canvas position:", {
                            top: canvasRect.top,
                            bottom: canvasRect.bottom,
                            left: canvasRect.left,
                            right: canvasRect.right,
                            width: canvasRect.width,
                            height: canvasRect.height,
                          })
                        }
                      }, 500)
                    } catch (error) {
                      console.error("❌ Failed to initialize game:", error)
                    }
                  }}
                  className={`w-48 h-auto cursor-pointer 
                                            transition-all duration-300 hover:scale-105 
                                            focus:outline-none active:scale-95
                                            ${
                                              isMinimized
                                                ? "opacity-50"
                                                : "opacity-100"
                                            }`}
                  title={isMinimized ? "Restore Game" : "Start Game"}
                >
                  <NomasImage
                    src={assets.petRisingGameButton}
                    alt={isMinimized ? "Restore Game" : "Start Game"}
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
          )}

          {/* Shop UI */}
          {showShop && (
            <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {gameScene ? (
                <div className="h-full overflow-hidden">
                  <ReactShopModal
                    isOpen={showShop}
                    onClose={() => setShowShop(false)}
                    scene={gameScene}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-semibold mb-4">
                      Loading Shop...
                    </h3>
                    <p className="text-gray-400">
                      Waiting for game scene to be ready
                    </p>
                    <div className="mt-4">
                      <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Home UI */}
          {showHome && (
            <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {gameScene ? (
                <ReactHomeModal
                  initialPetId={selectedPetId}
                  isOpen={showHome}
                  onClose={() => {
                    setShowHome(false)
                    setSelectedPetId(null)
                  }}
                  scene={gameScene}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-semibold mb-4">
                      Loading Home...
                    </h3>
                    <p className="text-gray-400">
                      Waiting for game scene to be ready
                    </p>
                    <div className="mt-4">
                      <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </NomasCardBody>
      </NomasCard>
    </>
  )
}
