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
  // Use scene directly from hook instead of detecting manually
  const { createGame, game, scene } = usePhaser()
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

  // Use scene from hook - no need to poll manually anymore
  // This effect is kept as fallback only if hook's scene detection fails
  useEffect(() => {
    // If we have scene from hook, use it directly
    if (scene) {
      setGameScene(scene)
      return // Scene from hook takes priority
    }

    // Fallback: If we already have scene in local state, just verify it's still valid
    if (gameScene && gameScene.scene) {
      // Verify scene is still valid by checking if it has getPetManager method
      try {
        const hasMethod =
          typeof (gameScene as GameScene).getPetManager === "function"
        if (hasMethod) {
          return // Scene is valid, no need to poll
        }
      } catch {
        // Scene might be invalid, continue to detect
      }
    }

    // Only continue with manual detection if scene from hook is not available
    if (scene) {
      return // Hook has scene, skip manual detection
    }

    const checkGameAndScene = () => {
      // Method 1: Try to get game from hook first
      let phaserGame: Phaser.Game | null = game || null

      // Method 2: Try ref
      if (!phaserGame) {
        phaserGame = phaserGameRef.current
      }

      // Method 3: Check global Phaser registry
      if (!phaserGame) {
        try {
          const phaserGames =
            (window as Window & { Phaser?: { GAMES?: Phaser.Game[] } }).Phaser
              ?.GAMES || []
          if (phaserGames.length > 0) {
            phaserGame = phaserGames[phaserGames.length - 1]
            console.log(
              "🔍 Found game in Phaser.GAMES registry:",
              phaserGames.length,
              "games"
            )
          }
        } catch (e) {
          console.log("⚠️ Error checking Phaser.GAMES:", e)
        }
      }

      // Method 4: Try to get game from canvas element or container
      if (!phaserGame) {
        const container = document.getElementById(CONTAINER_ID)
        const canvas = container?.querySelector("canvas")

        if (canvas) {
          try {
            // Check if Phaser stored game on container
            const containerGame = (
              container as unknown as Record<string, unknown>
            ).__phaser_game__ as Phaser.Game | undefined
            if (containerGame) {
              phaserGame = containerGame
              console.log("🔍 Found game on container element")
            }

            // Check if game is stored on canvas element
            if (!phaserGame) {
              const canvasGame = (canvas as unknown as Record<string, unknown>)
                .__phaser_game__ as Phaser.Game | undefined
              if (canvasGame) {
                phaserGame = canvasGame
                console.log("🔍 Found game on canvas element")
              }
            }

            // Try to get game from canvas parent (the game might store it there)
            if (!phaserGame && canvas.parentElement) {
              const parentGame = (
                canvas.parentElement as unknown as Record<string, unknown>
              ).__phaser_game__ as Phaser.Game | undefined
              if (parentGame) {
                phaserGame = parentGame
                console.log("🔍 Found game on canvas parent")
              }
            }
          } catch {
            // Continue
          }

          // Also check global registry when canvas exists - but more thoroughly
          if (!phaserGame) {
            try {
              const win = window as Window & {
                Phaser?: { GAMES?: Phaser.Game[] | Phaser.Game }
              }

              // Check if GAMES is an array
              if (win.Phaser?.GAMES) {
                if (Array.isArray(win.Phaser.GAMES)) {
                  const games = win.Phaser.GAMES
                  if (games.length > 0) {
                    phaserGame = games[games.length - 1]
                    console.log("🔍 Found game from Phaser.GAMES array")
                  }
                } else if (win.Phaser.GAMES instanceof Phaser.Game) {
                  // GAMES might be a single game instance, not an array
                  phaserGame = win.Phaser.GAMES
                  console.log(
                    "🔍 Found game from Phaser.GAMES (single instance)"
                  )
                }
              }
            } catch {
              // Continue
            }
          }
        }
      }

      // Method 5: Try to find game by traversing canvas and its properties
      if (!phaserGame) {
        try {
          const container = document.getElementById(CONTAINER_ID)
          const canvas = container?.querySelector("canvas")
          if (canvas) {
            // Try to find game by checking canvas properties
            // Sometimes Phaser stores game reference in various places
            const canvasAny = canvas as unknown as Record<string, unknown>

            // Check common property names where Phaser might store game
            const possibleGameProps = [
              "game",
              "_game",
              "__game",
              "__phaser_game__",
              "phaserGame",
              "_phaserGame",
            ]

            for (const prop of possibleGameProps) {
              if (canvasAny[prop] instanceof Phaser.Game) {
                phaserGame = canvasAny[prop] as Phaser.Game
                console.log(`🔍 Found game from canvas.${prop}`)
                break
              }
            }

            // Also check container properties
            if (!phaserGame && container) {
              const containerAny = container as unknown as Record<
                string,
                unknown
              >
              for (const prop of possibleGameProps) {
                if (containerAny[prop] instanceof Phaser.Game) {
                  phaserGame = containerAny[prop] as Phaser.Game
                  console.log(`🔍 Found game from container.${prop}`)
                  break
                }
              }
            }
          }
        } catch (e) {
          console.log("⚠️ Error in method 5:", e)
        }
      }

      // Method 6: Try to access game via Phaser's internal registry (if available)
      if (!phaserGame) {
        try {
          const win = window as Window & {
            Phaser?: {
              GAMES?: Phaser.Game[] | Phaser.Game
              Game?: typeof Phaser.Game
            }
          }

          // Check if Phaser has any way to get active games
          if (win.Phaser) {
            // Log Phaser object structure for debugging
            console.log("🔍 Phaser object keys:", Object.keys(win.Phaser))

            // Try to get games from various possible locations
            if (win.Phaser.GAMES) {
              if (
                Array.isArray(win.Phaser.GAMES) &&
                win.Phaser.GAMES.length > 0
              ) {
                phaserGame = win.Phaser.GAMES[win.Phaser.GAMES.length - 1]
                console.log("🔍 Found game from Phaser.GAMES (method 6)")
              } else if (win.Phaser.GAMES instanceof Phaser.Game) {
                phaserGame = win.Phaser.GAMES
                console.log("🔍 Found game from Phaser.GAMES single (method 6)")
              }
            }
          }
        } catch (e) {
          console.log("⚠️ Error in method 6:", e)
        }
      }

      // Debug: Log what we found
      if (!phaserGame) {
        const container = document.getElementById(CONTAINER_ID)
        const hasCanvas = !!container?.querySelector("canvas")
        const hasGlobalGames = !!(
          window as Window & { Phaser?: { GAMES?: Phaser.Game[] } }
        ).Phaser?.GAMES?.length
        console.log("🔍 Game detection status:", {
          gameFromHook: !!game,
          gameFromRef: !!phaserGameRef.current,
          hasCanvas,
          hasGlobalGames,
          containerExists: !!container,
        })
      }

      // If we have game, store it
      if (phaserGame && phaserGame !== phaserGameRef.current) {
        phaserGameRef.current = phaserGame
        console.log("✅✅✅ Phaser game instance found and stored!", {
          hasSceneManager: !!phaserGame.scene,
          hasScenes: !!phaserGame.scene?.scenes,
        })
      }

      // Try to get scene - this is the critical part
      if (phaserGame?.scene) {
        try {
          const sceneManager = phaserGame.scene

          // Debug: Log all available scenes
          if (sceneManager?.scenes) {
            try {
              const allScenes = Array.isArray(sceneManager.scenes)
                ? sceneManager.scenes
                : Object.values(sceneManager.scenes || {})
              console.log(
                "🔍 Available scenes:",
                (allScenes as Phaser.Scene[]).map((s) => ({
                  key: s?.scene?.key,
                  isActive: s?.scene?.isActive?.() || false,
                  isPaused: s?.scene?.isPaused?.() || false,
                }))
              )
            } catch (e) {
              console.log("⚠️ Could not log scenes:", e)
            }
          }

          // Method 1: Try to get scene by key - most reliable
          if (sceneManager) {
            try {
              // Try getting by key first
              let scene = sceneManager.getScene(
                SceneName.Gameplay
              ) as GameScene | null

              // If not found by key, try to get any GameScene instance by checking for GameScene methods
              if (!scene || !scene.scene) {
                // Try to get all scenes and find GameScene by checking for getPetManager method
                const allScenes = sceneManager.getScenes(
                  false
                ) as Phaser.Scene[]
                const gameSceneCandidate = allScenes.find((s) => {
                  const candidate = s as unknown as GameScene
                  return (
                    candidate && typeof candidate.getPetManager === "function"
                  )
                })
                if (gameSceneCandidate) {
                  scene = gameSceneCandidate as GameScene
                }
              }

              // Validate it's actually a GameScene by checking for getPetManager method
              if (scene) {
                const candidateScene = scene as unknown as GameScene
                const hasGetPetManager =
                  candidateScene &&
                  typeof candidateScene.getPetManager === "function"

                if (hasGetPetManager) {
                  console.log("✅ GameScene found via getScene()", {
                    sceneKey: candidateScene.scene?.key || "unknown",
                    hasGetPetManager: true,
                    isActive: candidateScene.scene?.isActive?.() || false,
                    isVisible: candidateScene.scene?.isVisible?.() || false,
                  })
                  setGameScene(candidateScene)
                  return true // Found scene, stop polling
                }
              }
            } catch (e) {
              console.log("⚠️ getScene() failed:", e)
            }
          }

          // Method 2: Try to get from scenes array/object
          if (sceneManager?.scenes) {
            const scenes = (
              Array.isArray(sceneManager.scenes)
                ? sceneManager.scenes
                : Object.values(sceneManager.scenes)
            ) as Phaser.Scene[]
            const scene = scenes.find(
              (s) => s?.scene?.key === SceneName.Gameplay
            ) as GameScene | undefined
            if (scene && scene.scene) {
              // Validate it's actually a GameScene by checking for getPetManager method
              const candidateScene = scene as unknown as GameScene
              const hasGetPetManager =
                candidateScene &&
                typeof candidateScene.getPetManager === "function"
              if (hasGetPetManager) {
                console.log("✅ GameScene found via scenes array")
                setGameScene(candidateScene)
                return true
              }
            }
          }

          // Method 3: Try to get all active scenes
          if (sceneManager?.getScenes) {
            try {
              const activeScenes = sceneManager.getScenes(
                true
              ) as Phaser.Scene[]
              const gameScene = activeScenes.find(
                (s) => s?.scene?.key === SceneName.Gameplay
              ) as GameScene | undefined
              if (gameScene) {
                // Validate it's actually a GameScene
                const candidateScene = gameScene as unknown as GameScene
                const hasGetPetManager =
                  candidateScene &&
                  typeof candidateScene.getPetManager === "function"
                if (hasGetPetManager) {
                  console.log("✅ GameScene found via getScenes(true)")
                  setGameScene(candidateScene)
                  return true
                }
              }

              // If not found in active, try all scenes
              const allScenes = sceneManager.getScenes(false) as Phaser.Scene[]
              const gameSceneFromAll = allScenes.find(
                (s) => s?.scene?.key === SceneName.Gameplay
              ) as GameScene | undefined
              if (gameSceneFromAll) {
                // Validate it's actually a GameScene
                const candidateScene = gameSceneFromAll as unknown as GameScene
                const hasGetPetManager =
                  candidateScene &&
                  typeof candidateScene.getPetManager === "function"
                if (hasGetPetManager) {
                  console.log("✅ GameScene found via getScenes(false)")
                  setGameScene(candidateScene)
                  return true
                }
              }
            } catch (e) {
              console.log("⚠️ getScenes() failed:", e)
            }
          }

          // Method 4: Try direct access if sceneManager has the scene as property
          if (sceneManager) {
            const sceneManagerAny = sceneManager as unknown as Record<
              string,
              unknown
            >
            if (sceneManagerAny[SceneName.Gameplay]) {
              const scene = sceneManagerAny[SceneName.Gameplay] as GameScene
              if (scene && scene.scene) {
                // Validate it's actually a GameScene
                const candidateScene = scene as unknown as GameScene
                const hasGetPetManager =
                  candidateScene &&
                  typeof candidateScene.getPetManager === "function"
                if (hasGetPetManager) {
                  console.log("✅ GameScene found via direct property access")
                  setGameScene(candidateScene)
                  return true
                }
              }
            }
          }
        } catch (error) {
          console.log("⏳ Scene detection error:", error)
        }
      } else {
        console.log("⚠️ phaserGame.scene is not available yet")
      }

      return false // Continue polling
    }

    // Try immediately
    const foundImmediately = checkGameAndScene()
    if (foundImmediately) {
      return // Scene found, no need to poll
    }

    // Poll every 200ms until we have scene
    // Continue polling even if we have gameScene to handle re-connections
    const intervalId = setInterval(() => {
      const found = checkGameAndScene()
      if (found && gameScene) {
        // If we already had scene and found again, don't log
        return
      }
      if (found) {
        console.log("🎯 Polling stopped - scene found!")
      }
    }, 200)

    // Also try multiple times with increasing delays to catch scene that just started
    const immediateChecks = [
      setTimeout(() => {
        if (checkGameAndScene()) {
          console.log("🎯 Immediate check (500ms) found scene!")
        }
      }, 500),
      setTimeout(() => {
        if (checkGameAndScene()) {
          console.log("🎯 Immediate check (1000ms) found scene!")
        }
      }, 1000),
      setTimeout(() => {
        if (checkGameAndScene()) {
          console.log("🎯 Immediate check (2000ms) found scene!")
        }
      }, 2000),
    ]

    // Clean up after 30 seconds (longer timeout since game might take time)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (!gameScene) {
        console.log(
          "⚠️ GameScene not found after 30 seconds - checking if game is running..."
        )
        // Final check
        checkGameAndScene()
      }
    }, 30000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      immediateChecks.forEach(clearTimeout)
    }
  }, [game, gameScene, scene]) // Include scene from hook to stop polling when hook has scene

  // Additional effect: When shop/home is opened, sync scene from hook if available
  useEffect(() => {
    if ((showShop || showHome) && !gameScene) {
      // First priority: use scene from hook
      if (scene) {
        console.log("✅✅✅ Scene from hook available, syncing for shop/home")
        setGameScene(scene)
        return
      }

      // Fallback: Try to get from game ref if hook doesn't have it yet
      if (game && game.scene) {
        console.log(
          "🔄 Shop/Home opened but no scene - trying to get from game"
        )
        try {
          const foundScene = game.scene.getScene(
            SceneName.Gameplay
          ) as GameScene | null
          if (foundScene) {
            const candidateScene = foundScene as unknown as GameScene
            if (
              candidateScene &&
              typeof candidateScene.getPetManager === "function"
            ) {
              console.log("✅✅✅ Scene found during shop/home check!")
              setGameScene(candidateScene)
            }
          }
        } catch {
          console.log("⚠️ Force check failed")
        }
      }
    }
  }, [showShop, showHome, gameScene, scene, game])

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
          {/* Shop can be opened and will auto-update when gameScene becomes available */}
          {showShop && (
            <div className="absolute inset-0 w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden z-50">
              {gameScene ? (
                <div className="w-full h-full overflow-hidden flex items-center justify-center p-4">
                  <ReactShopModal
                    isOpen={showShop}
                    onClose={() => {
                      console.log("🛒 Closing shop")
                      setShowShop(false)
                    }}
                    scene={gameScene}
                  />
                </div>
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
            </div>
          )}

          {/* Home UI - Render directly in NomasCardBody */}
          {/* Home can be opened and will auto-update when gameScene becomes available */}
          {showHome && (
            <div className="absolute inset-0 w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden z-50">
              {gameScene ? (
                <div className="w-full h-full overflow-hidden flex items-center justify-center p-4">
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
                </div>
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
            </div>
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
