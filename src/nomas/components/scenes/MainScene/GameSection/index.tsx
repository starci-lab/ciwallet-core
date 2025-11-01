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
import { GameScene } from "@/nomas/game/GameScene"
import { useColyseus, useGameAuthenticationSwrMutation } from "@/nomas/hooks"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import { usePhaser } from "@/nomas/hooks"
import { ReactHomeModal } from "@/nomas/game/ui/react-ui/modal/ReactHomeModal"
import { CONTAINER_ID } from "@/nomas/game/constants"

export const GameSection = () => {
  const assets = assetsConfig().app
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  // Use scene directly from hook instead of detecting manually
  const { createGame, scene } = usePhaser()
  const [gameScene, setGameScene] = useState<GameScene | null>(scene || null)

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

  // Sync scene from hook to local state
  useEffect(() => {
    if (scene && scene !== gameScene) {
      console.log("✅✅✅ gameScene synced from hook!", {
        sceneKey: scene.scene?.key,
        isActive: scene.scene?.isActive?.(),
      })
      setGameScene(scene)
    } else if (!scene && gameScene) {
      // Scene was removed, clear local state
      console.log("⏳ Scene removed from hook, clearing local state")
      setGameScene(null)
    }
  }, [scene, gameScene])

  // Log when gameScene changes
  useEffect(() => {
    if (gameScene) {
      console.log("✅✅✅ gameScene is now available!", {
        sceneKey: gameScene.scene?.key,
        isActive: gameScene.scene?.isActive?.(),
        showShop,
        showHome,
      })
    } else {
      console.log("⏳ gameScene is null")
    }
  }, [gameScene, showShop, showHome])

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

  // When shop/home is opened, ensure scene is synced from hook
  useEffect(() => {
    if ((showShop || showHome) && !gameScene && scene) {
      console.log("✅✅✅ Scene from hook available, syncing for shop/home")
      setGameScene(scene)
    }
  }, [showShop, showHome, gameScene, scene])

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
                  onClick={() => {
                    console.log(
                      "🛒 Shop button clicked, gameScene:",
                      !!gameScene
                    )
                    setShowShop(true)
                  }}
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

          {/* Shop UI - Render directly in NomasCardBody */}
          {showShop && (
            <>
              {gameScene ? (
                <ReactShopModal
                  isOpen={showShop}
                  onClose={() => {
                    console.log("🛒 Closing shop")
                    setShowShop(false)
                  }}
                  scene={gameScene}
                />
              ) : (
                // Show loading while waiting for gameScene - it will auto-update when ready
                <ShopLoadingState
                  scene={scene}
                  onSceneFound={(foundScene) => {
                    console.log("🎯 Shop: Scene found in loading state!")
                    setGameScene(foundScene)
                  }}
                />
              )}
            </>
          )}

          {/* Home UI - Render directly in NomasCardBody */}
          {showHome && (
            <>
              {gameScene ? (
                <ReactHomeModal
                  initialPetId={selectedPetId}
                  isOpen={showHome}
                  onClose={() => {
                    console.log("🏠 Closing home")
                    setShowHome(false)
                    setSelectedPetId(null)
                  }}
                  scene={gameScene}
                />
              ) : (
                // Show loading while waiting for gameScene - it will auto-update when ready
                <HomeLoadingState
                  scene={scene}
                  onSceneFound={(foundScene) => {
                    console.log("🎯 Home: Scene found in loading state!")
                    setGameScene(foundScene)
                  }}
                />
              )}
            </>
          )}
        </NomasCardBody>
      </NomasCard>
    </>
  )
}

// Loading state component that uses scene from hook
interface ShopLoadingStateProps {
  scene: GameScene | null
  onSceneFound: (scene: GameScene) => void
}

const ShopLoadingState: React.FC<ShopLoadingStateProps> = ({
  scene,
  onSceneFound,
}) => {
  useEffect(() => {
    // If scene is available from hook, use it immediately
    if (scene) {
      onSceneFound(scene)
    }
  }, [scene, onSceneFound])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-white">
        <h3 className="text-xl font-semibold mb-4">Loading Shop...</h3>
        <p className="text-gray-400">Waiting for game scene to be ready</p>
        <p className="text-gray-500 text-xs mt-2">
          Scene status:{" "}
          {scene ? "Scene ready ✅" : "Waiting for scene from hook..."}
        </p>
        <div className="mt-4">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

// Loading state component that uses scene from hook
interface HomeLoadingStateProps {
  scene: GameScene | null
  onSceneFound: (scene: GameScene) => void
}

const HomeLoadingState: React.FC<HomeLoadingStateProps> = ({
  scene,
  onSceneFound,
}) => {
  useEffect(() => {
    // If scene is available from hook, use it immediately
    if (scene) {
      onSceneFound(scene)
    }
  }, [scene, onSceneFound])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-white">
        <h3 className="text-xl font-semibold mb-4">Loading Home...</h3>
        <p className="text-gray-400">Waiting for game scene to be ready</p>
        <p className="text-gray-500 text-xs mt-2">
          Scene status:{" "}
          {scene ? "Scene ready ✅" : "Waiting for scene from hook..."}
        </p>
        <div className="mt-4">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
