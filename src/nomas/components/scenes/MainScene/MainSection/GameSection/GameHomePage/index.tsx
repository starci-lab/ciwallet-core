/* eslint-disable indent */
import { useEffect, useState } from "react"
import type { PetData } from "@/nomas/game/managers/PetManager"
import { eventBus } from "@/nomas/game/event-bus"
import {
  HomeEvents,
  type OpenHomeWithPetPayload,
  type PetDataUpdatePayload,
} from "@/nomas/game/events/home/HomeEvents"
import { FarmTab } from "@/nomas/game/ui/react-ui/components/FarmTab"
import { TasksTab } from "@/nomas/game/ui/react-ui/components/TasksTab"
import { ReferralsTab } from "@/nomas/game/ui/react-ui/components/ReferralsTab"
import {
  NomasCard,
  NomasCardBody,
  NomasCardVariant,
  NomasImage,
  NomasInput,
} from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"
import { assetsConfig } from "@/nomas/resources"

type TabType = "farm" | "tasks" | "referrals"

/**
 * GameHomePage - Full page home component
 * Replaces GameSplashPage when home is opened via HomeEvents.OpenHome
 * Displays home UI similar to ReactHomeModal but as a full page layout
 */
export const GameHomePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("farm")
  const [activePets, setActivePets] = useState<PetData[]>([])
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null)
  const [initialPetId, setInitialPetId] = useState<string | null>(null)

  const balance = useAppSelector((state) => state.stateless.user.nomToken)
  const assets = assetsConfig().game

  useEffect(() => {
    const handleOpenWithPet = (payload: OpenHomeWithPetPayload) => {
      console.log("🏠 Home opened with pet:", payload.petId)
      setInitialPetId(payload.petId || null)
    }
    eventBus.on(HomeEvents.OpenHomeWithPet, handleOpenWithPet)
    return () => {
      eventBus.off(HomeEvents.OpenHomeWithPet, handleOpenWithPet)
    }
  }, [])

  useEffect(() => {
    const handleClose = () => {
      setSelectedPet(null)
      setInitialPetId(null)
    }
    eventBus.on(HomeEvents.CloseHome, handleClose)
    return () => {
      eventBus.off(HomeEvents.CloseHome, handleClose)
    }
  }, [])

  useEffect(() => {
    const handlePetDataUpdate = (payload: PetDataUpdatePayload) => {
      try {
        if (!payload || !Array.isArray(payload.pets)) return

        setActivePets(payload.pets)

        if (selectedPet) {
          const updatedPet = payload.pets.find((p) => p.id === selectedPet.id)
          if (updatedPet) {
            setSelectedPet(updatedPet)
          } else {
            setSelectedPet(null)
          }
        }

        if (initialPetId && !selectedPet) {
          const targetPet = payload.pets.find((p) => p.id === initialPetId)
          if (targetPet) {
            setSelectedPet(targetPet)
            setActiveTab("farm")
          }
          setInitialPetId(null)
        }
      } catch (error) {
        console.error("Error handling pet data update:", error)
      }
    }

    eventBus.on(HomeEvents.PetDataUpdate, handlePetDataUpdate)
    return () => {
      eventBus.off(HomeEvents.PetDataUpdate, handlePetDataUpdate)
    }
  }, [selectedPet, initialPetId])

  const handleClose = () => {
    eventBus.emit(HomeEvents.CloseHome)
  }

  return (
    <NomasCard variant={NomasCardVariant.Gradient}>
      <NomasCardBody className="relative w-full h-full">
        <div className="w-full h-full bg-[#1a1a1a] flex flex-col">
          {/* Header */}
          <div className="relative bg-[#2a2a2a] px-3 py-2 border-b border-[rgba(135,135,135,0.25)]">
            {/* Back/Close Button */}
            <button
              onClick={handleClose}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#323232] rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Title/Logo */}
            <div className="flex items-center justify-center">
              <NomasImage
                src={assets.petRisingStoreLogo}
                alt="Pet Rising Store Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          {/* Balance Section */}
          <div className="bg-[#2a2a2a] px-2 py-1 border-b border-[rgba(135,135,135,0.25)]">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted pl-1">Balance</div>
                  <NomasInput
                    value={balance.toLocaleString()}
                    prefixIcon={
                      <NomasImage
                        src={assets.nomasCoin}
                        alt="NOM"
                        className="w-3 h-3"
                      />
                    }
                    currency="NOM"
                    numericOnly
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#1a1a1a] px-3 py-2 border-b border-[rgba(135,135,135,0.25)]">
            <div className="flex gap-3 justify-center">
              {[
                { key: "farm", label: "Farm" },
                { key: "tasks", label: "Tasks" },
                { key: "referrals", label: "Referrals" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`px-4 py-1.5 text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? "text-white border-b-2 border-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            {activeTab === "farm" && (
              <FarmTab
                activePets={activePets}
                selectedPet={selectedPet}
                setSelectedPet={setSelectedPet}
                onClose={handleClose}
              />
            )}

            {activeTab === "tasks" && <TasksTab />}

            {activeTab === "referrals" && <ReferralsTab />}
          </div>
        </div>
      </NomasCardBody>
    </NomasCard>
  )
}
