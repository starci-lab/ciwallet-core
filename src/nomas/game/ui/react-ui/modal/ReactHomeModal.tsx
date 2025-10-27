/* eslint-disable indent */
import { useEffect, useState } from "react"
import { GameScene } from "@/nomas/game/GameScene"
import { ScrollArea } from "@/nomas/components/shadcn/scroll-area"
import type { PetData } from "@/nomas/game/managers/PetManager"
import { ReactModalLayout } from "../layouts/ReactModalLayout"
import { FarmTab } from "../components/FarmTab"
import { TasksTab } from "../components/TasksTab"
import { ReferralsTab } from "../components/ReferralsTab"

type TabType = "farm" | "tasks" | "referrals"

export function ReactHomeModal({
  isOpen,
  onClose,
  scene,
}: {
  isOpen: boolean
  onClose: () => void
  scene: GameScene
}) {
  const [activeTab, setActiveTab] = useState<TabType>("tasks")
  const [activePets, setActivePets] = useState<PetData[]>([])
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null)

  // Update pets data in real-time
  useEffect(() => {
    if (!isOpen || !scene) return

    const updatePets = () => {
      const petManager = scene.getPetManager()
      if (petManager) {
        const pets = petManager.getAllPets()
        setActivePets(pets)

        // Update selected pet data if it exists
        if (selectedPet) {
          const updatedPet = pets.find((p) => p.id === selectedPet.id)
          if (updatedPet) {
            setSelectedPet(updatedPet)
          }
        }
      }
    }

    // Initial load
    updatePets()

    // Update every second for real-time stats
    const interval = setInterval(updatePets, 1000)

    return () => clearInterval(interval)
  }, [isOpen, scene, selectedPet?.id])

  if (!isOpen) return null

  return (
    <ReactModalLayout
      onClose={onClose}
      showBalance={true}
      showEarnings={true}
      titleLogo={true}
    >
      {/* Tabs */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[rgba(135,135,135,0.25)]">
        <div className="flex gap-4 justify-center">
          {[
            { key: "farm", label: "Farm" },
            { key: "tasks", label: "Tasks" },
            { key: "referrals", label: "Referrals" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-6 py-2 text-base font-semibold transition-all ${
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
      <ScrollArea className="flex-1">
        {activeTab === "farm" && (
          <FarmTab
            activePets={activePets}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
            scene={scene}
            onClose={onClose}
          />
        )}

        {activeTab === "tasks" && <TasksTab />}

        {activeTab === "referrals" && <ReferralsTab />}
      </ScrollArea>
    </ReactModalLayout>
  )
}
