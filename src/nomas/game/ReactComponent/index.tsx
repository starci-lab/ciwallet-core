/* eslint-disable indent */
import { useEffect, useRef, useState, type FC } from "react"
import { Game } from "phaser"
import { useAppDispatch, useAppSelector } from "@/nomas/redux"
import {
  eventBus as purchaseEventBus,
  PurchaseEvents,
  type PurchaseSystem,
} from "@/nomas/game/systems"
import { eventBus } from "@/nomas/game/event-bus"
import { ShopEvents } from "@/nomas/game/events/shop/ShopEvents"
import { ReactShopModal } from "@/nomas/game/ui/react-ui/modal/ReactShopModal"
import { createPortal } from "react-dom"
import { GameScene as PhaserGameScene } from "@/nomas/game/GameScene"
import { ReactHomeModal } from "../ui/react-ui/modal/ReactHomeModal"
import { CONTAINER_ID } from "@/nomas/game/constants"

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

    // Try to find NomasCardBody container, otherwise fallback to body
    let targetContainer: HTMLElement | null = null
    let createdEl: HTMLElement | null = null

    // Look for NomasCardBody by finding elements with 'relative w-full' classes (GameSplashPage pattern)
    const directBody = document.querySelector(".relative.w-full") as HTMLElement
    if (directBody) {
      targetContainer = directBody
    } else {
      // Fallback: look for any relative positioned container
      const relativeContainers = document.querySelectorAll(
        "[class*=\"relative\"]"
      )
      for (let i = relativeContainers.length - 1; i >= 0; i--) {
        const el = relativeContainers[i] as HTMLElement
        if (el && el.offsetParent !== null && el.offsetWidth > 0) {
          targetContainer = el
          break
        }
      }
    }

    // If no target found, create element in body (fallback)
    if (!targetContainer) {
      createdEl = document.createElement("div")
      createdEl.style.position = "fixed"
      createdEl.style.top = "50%"
      createdEl.style.right = "8%"
      createdEl.style.transform = "translateY(-50%)"
      createdEl.style.zIndex = "1001"
      document.body.appendChild(createdEl)
      setContainer(createdEl)
    } else {
      // Create a wrapper div inside the target container
      createdEl = document.createElement("div")
      createdEl.style.position = "absolute"
      createdEl.style.top = "0"
      createdEl.style.left = "0"
      createdEl.style.right = "0"
      createdEl.style.bottom = "0"
      createdEl.style.zIndex = "1001"
      createdEl.style.pointerEvents = "none" // Allow clicks through when closed
      // Ensure target container has relative positioning
      const computedStyle = window.getComputedStyle(targetContainer)
      if (computedStyle.position === "static") {
        targetContainer.style.position = "relative"
      }
      targetContainer.appendChild(createdEl)
      setContainer(createdEl)
    }

    const openHandler = () => {
      setIsOpen(true)
      scene.registry.set("reactShopOpen", true)
      // Enable pointer events when modal opens
      if (createdEl) {
        createdEl.style.pointerEvents = "auto"
      }
    }
    const closeHandler = () => {
      setIsOpen(false)
      scene.registry.set("reactShopOpen", false)
      // Disable pointer events when modal closes
      if (createdEl) {
        createdEl.style.pointerEvents = "none"
      }
    }
    // Mark React shop as available as soon as portal mounts
    scene.registry.set("reactShopReady", true)
    scene.events.on("open-react-shop", openHandler)
    scene.events.on("close-react-shop", closeHandler)

    // Also listen to global event bus for shop open/close (for testing from other components)
    const globalOpenHandler = () => {
      if (scene && scene.events) {
        scene.events.emit("open-react-shop")
      }
    }
    const globalCloseHandler = () => {
      if (scene && scene.events) {
        scene.events.emit("close-react-shop")
      }
    }
    eventBus.on(ShopEvents.OpenShop, globalOpenHandler)
    eventBus.on(ShopEvents.CloseShop, globalCloseHandler)
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
    purchaseEventBus.on(
      PurchaseEvents.PurchaseSuccess,
      onPurchaseSuccess as unknown as (...args: unknown[]) => void
    )
    return () => {
      scene.events.off("open-react-shop", openHandler)
      scene.events.off("close-react-shop", closeHandler)
      eventBus.off(ShopEvents.OpenShop, globalOpenHandler)
      eventBus.off(ShopEvents.CloseShop, globalCloseHandler)
      purchaseEventBus.off(
        PurchaseEvents.PurchaseSuccess,
        onPurchaseSuccess as unknown as (...args: unknown[]) => void
      )
      scene.registry.set("reactShopReady", false)
      scene.registry.set("reactShopOpen", false)
      if (createdEl) {
        createdEl.remove()
      }
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
