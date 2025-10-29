/* eslint-disable indent */
import { useEffect, useMemo, useRef, useState, type FC } from "react"
import { Game } from "phaser"
import Phaser from "phaser"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import {
  eventBus,
  PurchaseEvents,
  type PurchaseSystem,
} from "@/nomas/game/systems"
import { ReactShopModal } from "@/nomas/game/ui/react-ui/modal/ReactShopModal"
import { createPortal } from "react-dom"
// import type { GameRoomState } from "@/nomas/game/schema/ChatSchema"
import {
  getConfig,
  CONTAINER_ID,
  SceneName,
} from "@/nomas/game/configs/phaser-config"
import { GameScene as PhaserGameScene } from "@/nomas/game/GameScene"
import http from "@/nomas/utils/http"
import { setAddressWallet } from "@/nomas/redux/slices/stateless/user"
import { ROUTES } from "@/nomas/constants/route"
import type { GameRoomState } from "@/nomas/game/schema/ChatSchema"
import { createColyseus } from "@/nomas/hooks/singleton/colyseus/createColyseus"
import { ReactHomeModal } from "../ui/react-ui/modal/ReactHomeModal"

export type ReactComponentProps = {
  signMessage: (message: string) => Promise<string>
  publicKey: string
}

<<<<<<< HEAD:src/nomas/game/GameScene/index.tsx
export const GameComponent: FC<GameComponentProps> = ({
  signMessage,
  publicKey,
}) => {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Game | null>(null)
  const sceneRef = useRef<PhaserGameScene | null>(null)
  const hasBootedRef = useRef(false)
=======
export const ReactComponent: FC<ReactComponentProps> = ({
    signMessage,
    publicKey,
}) => {
    const gameRef = useRef<Phaser.Game | null>(null)
>>>>>>> 774244d9be832193b790f54d9629df3217f5f33d:src/nomas/game/ReactComponent/index.tsx

  const [isGameInitialized, setIsGameInitialized] = useState(false)
  const addressWallet = useAppSelector(
    (state) => state.stateless.user.addressWallet
  )
  const setAddressDispatch = useAppDispatch()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    !!addressWallet
  )
  const [isMinimized, setIsMinimized] = useState(false)
  const [gameContainerStyle, setGameContainerStyle] = useState({
    width: "100%",
    height: "100%",
    transform: "translateY(0)",
    transition: "transform 0.3s ease",
  })
  const colyseusApi = useMemo(() => {
    const env = import.meta.env as { VITE_BASE_SOCKET?: string }
    return createColyseus<GameRoomState>(
      env.VITE_BASE_SOCKET || "ws://localhost:2567"
    )
    // return createColyseus<GameRoomState>(
    //     "https://minute-lifetime-retrieved-referred.trycloudflare.com"
    // )
  }, [])
  const hookRoom = colyseusApi.useColyseusRoom()

  // Colyseus connection will be handled by the Phaser scene directly

<<<<<<< HEAD:src/nomas/game/GameScene/index.tsx
  useEffect(() => {
    console.log("🔍 Game initialization check:", {
      gameRef: !!gameRef.current,
      isUserAuthenticated,
      isGameInitialized,
    })

    if (!gameRef.current || !isUserAuthenticated || isGameInitialized) {
      console.log("❌ Skipping game initialization")
      return
    }
    // Ensure the container has the expected id for Phaser parent binding
    if (gameRef.current && gameRef.current.id !== CONTAINER_ID) {
      gameRef.current.id = CONTAINER_ID
    }
    if (hasBootedRef.current || phaserGameRef.current) {
      console.log("❌ Game already booted, skipping new Phaser.Game()")
      return
    }
    console.log("🎮 Starting Phaser game initialization...")

    try {
      phaserGameRef.current = new Phaser.Game(getConfig(gameRef.current))
      hasBootedRef.current = true

      // Store the game instance globally for other components to access
      ;(window as any).phaserGame = phaserGameRef.current

      console.log("✅ Phaser Game created successfully")

      // Poll for scene registration to be robust under Strict Mode double-mount
      let attempts = 0
      const pollScene = () => {
        attempts += 1
        sceneRef.current =
          (phaserGameRef.current?.scene.getScene(
            SceneName.Gameplay
          ) as PhaserGameScene) || null
=======
    useEffect(() => {
        console.log("🔍 Game initialization check:", {
            gameRef: !!gameRef.current,
            isUserAuthenticated,
            isGameInitialized,
        })
        if (!gameRef.current || !isUserAuthenticated || isGameInitialized) {
            console.log("❌ Skipping game initialization")
            return
        }
        if (hasBootedRef.current || gameRef.current) {
            console.log("❌ Game already booted, skipping new Phaser.Game()")
            return
        }
        console.log("🎮 Starting Phaser game initialization...")
        try {
            gameRef.current = new Phaser.Game(getConfig(gameRef.current))
            hasBootedRef.current = true
            console.log("✅ Phaser Game created successfully")
            // Poll for scene registration to be robust under Strict Mode double-mount
            let attempts = 0
            const pollScene = () => {
                attempts += 1
                sceneRef.current =
          (gameRef.current?.scene.getScene(
              SceneName.Gameplay
          ) as PhaserGameScene) || null
                if (sceneRef.current) {
                    console.log("✅ GameScene loaded successfully")
                    setIsGameInitialized(true)
                    // Colyseus connection will be handled by the scene itself
                    return
                }
                if (attempts < 30) {
                    setTimeout(pollScene, 200)
                } else {
                    console.error("❌ GameScene still not available after polling")
                }
            }
            setTimeout(pollScene, 200)
        } catch (error) {
            console.error("❌ Failed to create Phaser Game:", error)
        }

        const handleResize = () => {
            if (gameRef.current) {
                gameRef.current.scale.resize(window.innerWidth, 160)
            }
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            // In dev (React Strict Mode), avoid destroying immediately to prevent
            // double-mount teardown from killing the Phaser instance.
            const env = import.meta.env as { DEV?: boolean }
            if (!env.DEV && gameRef.current) {
                gameRef.current.destroy(true)
                gameRef.current = null
                hasBootedRef.current = false
                // Clean up global reference
                gameRef.current = null
            }
        }
    }, [isUserAuthenticated, isGameInitialized])

    // Colyseus connection is handled by the Phaser scene

    useEffect(() => {
        if (!isUserAuthenticated) return
        const scene = sceneRef.current
        if (!scene) return
        if (hookRoom) return

        const connect = () => {
            colyseusApi
                .connectToColyseus("single_player", {
                    name: "Pet Game",
                    addressWallet: addressWallet || undefined,
                })
                .catch(() => {
                    // ignore
                })
        }

        if (isGameInitialized) {
            connect()
            return
        }

        scene.events.once("assets-ready", connect)
        return () => {
            // phaser's event emitter typings are broad; cast to unknown first
            scene.events.off(
                "assets-ready",
        connect as unknown as (...args: unknown[]) => void
            )
        }
    }, [
        isUserAuthenticated,
        isGameInitialized,
        hookRoom,
        addressWallet,
        colyseusApi,
    ])
    // Colyseus connection is handled by the Phaser scene itself

    useEffect(() => {
        if (addressWallet) {
            setIsUserAuthenticated(true)
            return
        }
        setIsUserAuthenticated(false)
        console.log("🔐 Authentication check:", {
            signMessage: !!signMessage,
            publicKey: !!publicKey,
        })

        if (!signMessage || !publicKey) {
            return
        }

        const handleSignMessage = async () => {
            try {
                console.log("🔐 Starting authentication process...")

                const response = await http.get(ROUTES.getMessage)
                const messageToSign = response.data.message
                console.log("📝 Message to sign:", messageToSign)

                const signedMessage = await signMessage(messageToSign)
                if (!signedMessage || signedMessage === "") {
                    console.log("❌ No signature received")
                    return
                }
                console.log("✅ Signed message:", signedMessage)

                console.log("🔍 Verifying signature...")
                const verifyResponse = await http.post(ROUTES.verify, {
                    message: messageToSign,
                    address: publicKey,
                    signature: signedMessage,
                })
                console.log("✅ Verify response:", verifyResponse)

                setAddressDispatch(setAddressWallet(verifyResponse.data.wallet_address))
                console.log("🎉 Authentication successful!")
            } catch (error) {
                console.error("❌ Authentication failed:", error)
                console.error("Error details:", {
                    message: error instanceof Error ? error.message : "Unknown error",
                    stack: error instanceof Error ? error.stack : undefined,
                    response: error?.response?.data || error?.response || undefined,
                    status: error?.response?.status || undefined,
                })
            }
        }
        handleSignMessage()
    }, [publicKey, signMessage, addressWallet, setAddressWallet])

    // Keyboard shortcut for minimize/restore (Ctrl+M or Cmd+M)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "m") {
                event.preventDefault()
                handleMinimizeToggle()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isMinimized])

    // Listen for minimize events from GameSection
    useEffect(() => {
        const handleGameMinimizeToggle = (_event: CustomEvent) => {
            handleMinimizeToggle()
        }

        window.addEventListener(
            "toggleGameMinimize",
      handleGameMinimizeToggle as EventListener
        )
        return () => {
            window.removeEventListener(
                "toggleGameMinimize",
        handleGameMinimizeToggle as EventListener
            )
        }
    }, [isMinimized])

    // Minimize/Restore handler
    const handleMinimizeToggle = () => {
>>>>>>> 774244d9be832193b790f54d9629df3217f5f33d:src/nomas/game/ReactComponent/index.tsx
        if (sceneRef.current) {
          console.log("✅ GameScene loaded successfully")
          setIsGameInitialized(true)
          // Colyseus connection will be handled by the scene itself
          return
        }
        if (attempts < 30) {
          setTimeout(pollScene, 200)
        } else {
          console.error("❌ GameScene still not available after polling")
        }
      }
      setTimeout(pollScene, 200)
    } catch (error) {
      console.error("❌ Failed to create Phaser Game:", error)
    }

    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.resize(window.innerWidth, 160)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      // In dev (React Strict Mode), avoid destroying immediately to prevent
      // double-mount teardown from killing the Phaser instance.
      const env = import.meta.env as { DEV?: boolean }
      if (!env.DEV && phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
        hasBootedRef.current = false
        // Clean up global reference
        ;(window as any).phaserGame = null
      }
    }
  }, [isUserAuthenticated, isGameInitialized])

  // Colyseus connection is handled by the Phaser scene

  useEffect(() => {
    if (!isUserAuthenticated) return
    const scene = sceneRef.current
    if (!scene) return
    if (hookRoom) return

    const connect = () => {
      colyseusApi
        .connectToColyseus("single_player", {
          name: "Pet Game",
          addressWallet: addressWallet || undefined,
        })
        .catch(() => {
          // ignore
        })
    }

    if (isGameInitialized) {
      connect()
      return
    }

    scene.events.once("assets-ready", connect)
    return () => {
      // phaser's event emitter typings are broad; cast to unknown first
      scene.events.off(
        "assets-ready",
        connect as unknown as (...args: unknown[]) => void
      )
    }
  }, [
    isUserAuthenticated,
    isGameInitialized,
    hookRoom,
    addressWallet,
    colyseusApi,
  ])
  // Colyseus connection is handled by the Phaser scene itself

  useEffect(() => {
    if (addressWallet) {
      setIsUserAuthenticated(true)
      return
    }
    setIsUserAuthenticated(false)
    console.log("🔐 Authentication check:", {
      signMessage: !!signMessage,
      publicKey: !!publicKey,
    })

    if (!signMessage || !publicKey) {
      return
    }

    const handleSignMessage = async () => {
      try {
        console.log("🔐 Starting authentication process...")

        const response = await http.get(ROUTES.getMessage)
        const messageToSign = response.data.message
        console.log("📝 Message to sign:", messageToSign)

        const signedMessage = await signMessage(messageToSign)
        if (!signedMessage || signedMessage === "") {
          console.log("❌ No signature received")
          return
        }
        console.log("✅ Signed message:", signedMessage)

        console.log("🔍 Verifying signature...")
        const verifyResponse = await http.post(ROUTES.verify, {
          message: messageToSign,
          address: publicKey,
          signature: signedMessage,
        })
        console.log("✅ Verify response:", verifyResponse)

        setAddressDispatch(setAddressWallet(verifyResponse.data.wallet_address))
        console.log("🎉 Authentication successful!")
      } catch (error) {
        console.error("❌ Authentication failed:", error)
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          response: error?.response?.data || error?.response || undefined,
          status: error?.response?.status || undefined,
        })
      }
    }
    handleSignMessage()
  }, [publicKey, signMessage, addressWallet, setAddressWallet])

  // Keyboard shortcut for minimize/restore (Ctrl+M or Cmd+M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault()
        handleMinimizeToggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMinimized])

  // Listen for minimize events from GameSection
  useEffect(() => {
    const handleGameMinimizeToggle = (_event: CustomEvent) => {
      handleMinimizeToggle()
    }

    window.addEventListener(
      "toggleGameMinimize",
      handleGameMinimizeToggle as EventListener
    )
    return () => {
      window.removeEventListener(
        "toggleGameMinimize",
        handleGameMinimizeToggle as EventListener
      )
    }
  }, [isMinimized])

  // Minimize/Restore handler
  const handleMinimizeToggle = () => {
    if (sceneRef.current) {
      sceneRef.current.toggleMinimize()
      const newMinimizedState = sceneRef.current.getMinimizeState()
      setIsMinimized(newMinimizedState)

      // Dispatch event to GameSection to sync state
      const stateEvent = new CustomEvent("gameMinimizeStateChanged", {
        detail: { isMinimized: newMinimizedState },
      })
      window.dispatchEvent(stateEvent)

      // Update game container style for background minimize
      if (newMinimizedState) {
        setGameContainerStyle({
          width: "100%",
          height: "60px", // Minimized height
          transform: "translateY(80px)", // Move down to show only small bar
          transition: "all 0.3s ease",
        })
      } else {
        setGameContainerStyle({
          width: "100%",
          height: "100%",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
        })
      }
    }
  }

  return (
    <>
      {/* Minimize/Restore Button - Viewport Level */}
      {isUserAuthenticated && sceneRef.current && (
        <div className="fixed top-5 right-5 z-[10000] pointer-events-auto">
          <button
            onClick={handleMinimizeToggle}
            title={
              isMinimized ? "Restore Game (Ctrl+M)" : "Minimize Game (Ctrl+M)"
            }
            className="w-8 h-8 bg-gradient-to-b from-[#1D1D1D] to-[#141414] 
                                   rounded-full border-[3px] border-[rgba(135,135,135,0.7)]
                                   shadow-[0px_6px_20px_rgba(0,0,0,0.6),inset_0px_2px_4px_rgba(255,255,255,0.1)]
                                   cursor-pointer flex items-center justify-center text-xl
                                   text-[#B3B3B3] transition-all duration-300 ease-in-out
                                   font-['Plus_Jakarta_Sans',sans-serif] outline-none
                                   hover:scale-120 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.8),inset_0px_2px_4px_rgba(255,255,255,0.2)]
                                   hover:border-[rgba(135,135,135,1)] hover:text-white"
          >
            {isMinimized ? "🔺" : "🔻"}
          </button>
        </div>
      )}

      <div
        className={`fixed bottom-0 left-0 w-screen z-[1000] border-none bg-transparent
                           transition-all duration-300 ease-in-out
                           ${
                             isMinimized
                               ? "h-[60px] translate-y-20"
                               : "h-[140px] translate-y-0"
                           }`}
      >
        {!isUserAuthenticated && (
          <div className="flex justify-center items-center h-full text-white text-base font-bold bg-transparent">
            Authenticating...
          </div>
        )}
        <div
          ref={gameRef}
          id={CONTAINER_ID}
          className={`w-full h-full bg-transparent ${
            isUserAuthenticated ? "block" : "hidden"
          }`}
          style={gameContainerStyle}
        />
        {isUserAuthenticated && sceneRef.current && (
          <>
            <ShopPortal scene={sceneRef.current} />
            <HomePortal scene={sceneRef.current} />
          </>
        )}

        {/* Minimized Game Bar */}
        {isMinimized && isUserAuthenticated && (
          <div
            onClick={handleMinimizeToggle}
            className="absolute bottom-0 left-0 w-full h-[60px] 
                                   bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]
                                   border-t-2 border-[#4caf50] flex items-center justify-between
                                   px-5 shadow-[0_-4px_12px_rgba(0,0,0,0.3)] z-[1001]
                                   cursor-pointer transition-all duration-200 ease-in-out
                                   hover:bg-gradient-to-br hover:from-[#2a2a2a] hover:to-[#3d3d3d]
                                   hover:-translate-y-0.5 hover:shadow-[0_-6px_16px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
              <span className="text-white text-sm font-bold font-mono">
                🎮 Pet Game - Minimized
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#b3b3b3] text-xs font-mono">
                Click anywhere to restore • Ctrl+M
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMinimizeToggle()
                }}
                className="px-3 py-1.5 bg-[#4caf50] rounded-md text-[11px] text-white
                                           font-mono font-bold border-none cursor-pointer
                                           transition-all duration-200 ease-in-out
                                           shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                                           hover:bg-[#45a049] hover:scale-105 hover:shadow-[0_3px_6px_rgba(0,0,0,0.4)]"
              >
                🔺 RESTORE
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const ShopPortal: FC<{ scene: PhaserGameScene }> = ({ scene }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [_purchaseSystem, setPurchaseSystem] = useState<
    PurchaseSystem | undefined
  >(undefined)

  useEffect(() => {
    setPurchaseSystem(scene.getPurchaseSystem())
    const el = document.createElement("div")
    el.style.position = "fixed"
    el.style.top = "50%"
    el.style.right = "8%"
    el.style.transform = "translateY(-50%)"
    el.style.zIndex = "1001"
    document.body.appendChild(el)
    setContainer(el)

    const openHandler = () => {
      setIsOpen(true)
      scene.registry.set("reactShopOpen", true)
    }
    const closeHandler = () => {
      setIsOpen(false)
      scene.registry.set("reactShopOpen", false)
    }
    // Mark React shop as available as soon as portal mounts
    scene.registry.set("reactShopReady", true)
    scene.events.on("open-react-shop", openHandler)
    scene.events.on("close-react-shop", closeHandler)
    const onPurchaseSuccess = (data: {
      itemType: string
      itemId: string
      itemData?: { texture?: string }
    }) => {
      if (
        data.itemType === "background" &&
        data.itemData &&
        data.itemData.texture
      ) {
        try {
          scene.createBackground(data.itemData.texture)
        } catch {
          // ignore
        }
      }
    }
    eventBus.on(
      PurchaseEvents.PurchaseSuccess,
      onPurchaseSuccess as unknown as (...args: unknown[]) => void
    )
    return () => {
      scene.events.off("open-react-shop", openHandler)
      scene.events.off("close-react-shop", closeHandler)
      eventBus.off(
        PurchaseEvents.PurchaseSuccess,
        onPurchaseSuccess as unknown as (...args: unknown[]) => void
      )
      scene.registry.set("reactShopReady", false)
      scene.registry.set("reactShopOpen", false)
      el.remove()
    }
  }, [scene])

  // Keep PurchaseSystem reference in sync when it appears later
  useEffect(() => {
    const id = setInterval(() => {
      const ps = scene.getPurchaseSystem()
      if (ps) {
        setPurchaseSystem(ps)
      }
    }, 250)
    return () => clearInterval(id)
  }, [scene])

  if (!container) return null
  return createPortal(
    <ReactShopModal
      isOpen={isOpen}
      onClose={() => scene.events.emit("close-react-shop")}
      scene={scene}
    />,
    container
  )
}

// Thêm ngay sau ShopPortal (sau dòng 480)
const HomePortal: FC<{ scene: PhaserGameScene }> = ({ scene }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  useEffect(() => {
    const el = document.createElement("div")
    el.style.position = "fixed"
    el.style.top = "50%"
    el.style.right = "8%"
    el.style.transform = "translateY(-50%)"
    el.style.zIndex = "1001"
    document.body.appendChild(el)
    setContainer(el)

    const openHandler = () => {
      console.log("🏠 HomePortal: Opening home modal")
      setIsOpen(true)
      setSelectedPetId(null) // Clear selected pet
      scene.registry.set("reactHomeOpen", true)
    }

    const openWithPetHandler = (petId: string) => {
      console.log("Opening home modal pet:", petId)
      setSelectedPetId(petId)
      setIsOpen(true)
      scene.registry.set("reactHomeOpen", true)
    }

    const closeHandler = () => {
      console.log("Closing home modal")
      setIsOpen(false)
      setSelectedPetId(null)
      scene.registry.set("reactHomeOpen", false)
    }

    // Mark React home as available
    scene.registry.set("reactHomeReady", true)
    scene.events.on("open-react-home", openHandler)
    scene.events.on("open-react-home-with-pet", openWithPetHandler)
    scene.events.on("close-react-home", closeHandler)

    console.log("Event listeners registered")

    return () => {
      scene.events.off("open-react-home", openHandler)
      scene.events.off("open-react-home-with-pet", openWithPetHandler)
      scene.events.off("close-react-home", closeHandler)
      scene.registry.set("reactHomeReady", false)
      scene.registry.set("reactHomeOpen", false)
      el.remove()
      console.log("Cleaned up")
    }
  }, [scene])

  if (!container) return null
  return createPortal(
    <ReactHomeModal
      isOpen={isOpen}
      onClose={() => scene.events.emit("close-react-home")}
      scene={scene}
      initialPetId={selectedPetId}
    />,
    container
  )
}
