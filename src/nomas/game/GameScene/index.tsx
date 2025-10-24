import { useEffect, useMemo, useRef, useState, type FC } from "react"
import { Game } from "phaser"
import Phaser from "phaser"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import {
  eventBus,
  PurchaseEvents,
  type PurchaseSystem,
} from "@/nomas/game/systems"
import { ReactShopModal } from "@/nomas/game/ui/modal/ReactShopModal"
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

export type GameComponentProps = {
  signMessage: (message: string) => Promise<string>
  publicKey: string
}

export const GameComponent: FC<GameComponentProps> = ({
  signMessage,
  publicKey,
}) => {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Game | null>(null)
  const sceneRef = useRef<PhaserGameScene | null>(null)
  const hasBootedRef = useRef(false)

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
      console.log("✅ Phaser Game created successfully")

      // Poll for scene registration to be robust under Strict Mode double-mount
      let attempts = 0
      const pollScene = () => {
        attempts += 1
        sceneRef.current =
          (phaserGameRef.current?.scene.getScene(
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
        const response = await http.get(ROUTES.getMessage)
        const messageToSign = response.data.message
        const signedMessage = await signMessage(messageToSign)
        if (!signedMessage || signedMessage === "") {
          return
        }

        const verifyResponse = await http.post(ROUTES.verify, {
          message: messageToSign,
          address: publicKey,
          signature: signedMessage,
        })

        setAddressDispatch(setAddressWallet(verifyResponse.data.wallet_address))
      } catch {
        // ignore
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

  // Minimize/Restore handler
  const handleMinimizeToggle = () => {
    if (sceneRef.current) {
      sceneRef.current.toggleMinimize()
      const newMinimizedState = sceneRef.current.getMinimizeState()
      setIsMinimized(newMinimizedState)

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
        <div
          style={{
            position: "fixed",
            bottom: isMinimized ? "20px" : "130px",
            left: "20px",
            zIndex: 10000,
            pointerEvents: "auto",
            transition: "all 0.3s ease",
          }}
        >
          <button
            onClick={handleMinimizeToggle}
            title={
              isMinimized ? "Restore Game (Ctrl+M)" : "Minimize Game (Ctrl+M)"
            }
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(180deg, #1D1D1D 0%, #141414 100%)",
              borderRadius: "50%",
              border: "3px solid rgba(135,135,135,0.7)",
              boxShadow:
                "0px 6px 20px rgba(0,0,0,0.6), inset 0px 2px 4px rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#B3B3B3",
              transition: "all 0.3s ease",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.2)"
              e.currentTarget.style.boxShadow =
                "0px 8px 25px rgba(0,0,0,0.8), inset 0px 2px 4px rgba(255,255,255,0.2)"
              e.currentTarget.style.borderColor = "rgba(135,135,135,1)"
              e.currentTarget.style.color = "#ffffff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow =
                "0px 6px 20px rgba(0,0,0,0.6), inset 0px 2px 4px rgba(255,255,255,0.1)"
              e.currentTarget.style.borderColor = "rgba(135,135,135,0.7)"
              e.currentTarget.style.color = "#B3B3B3"
            }}
          >
            {isMinimized ? "🔺" : "🔻"}
          </button>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: isMinimized ? "60px" : "140px",
          zIndex: 1000,
          border: "none",
          background: "transparent",
          transform: isMinimized ? "translateY(80px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}
      >
        {!isUserAuthenticated && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              background: "transparent",
            }}
          >
            Authenticating...
          </div>
        )}
        <div
          ref={gameRef}
          id={CONTAINER_ID}
          style={{
            width: "100%",
            height: "100%",
            display: isUserAuthenticated ? "block" : "none",
            background: "transparent",
            ...gameContainerStyle,
          }}
        />
        {isUserAuthenticated && sceneRef.current && (
          <ShopPortal scene={sceneRef.current} />
        )}

        {/* Minimized Game Bar */}
        {isMinimized && isUserAuthenticated && (
          <div
            onClick={handleMinimizeToggle}
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "100%",
              height: "60px",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              borderTop: "2px solid #4caf50",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.3)",
              zIndex: 1001,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%)"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 -6px 16px rgba(0,0,0,0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 -4px 12px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                🎮 Pet Game - Minimized
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  color: "#b3b3b3",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                Click anywhere to restore • Ctrl+M
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMinimizeToggle()
                }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4caf50",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "white",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#45a049"
                  e.currentTarget.style.transform = "scale(1.05)"
                  e.currentTarget.style.boxShadow = "0 3px 6px rgba(0,0,0,0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4caf50"
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"
                }}
              >
                🔺 RESTORE
              </button>
            </div>
          </div>
        )}

        {/* CSS Animation for pulse effect */}
        <style>
          {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
        </style>
      </div>
    </>
  )
}

const ShopPortal: FC<{ scene: PhaserGameScene }> = ({ scene }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [purchaseSystem, setPurchaseSystem] = useState<
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
