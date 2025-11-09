/* eslint-disable indent */
import { useEffect, useState } from "react"
import { GameScene } from "@/nomas/game/GameScene"
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
  initialPetId,
}: {
  isOpen: boolean
  onClose: () => void
  scene: GameScene
  initialPetId?: string | null
}) {
  const [activeTab, setActiveTab] = useState<TabType>("farm")
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

  // handle case initial pet, when add pet id
  useEffect(() => {
    if (!isOpen || !initialPetId || !scene) return

    console.log("Opening home with pet:", initialPetId)
    setActiveTab("farm")

    const petManager = scene.getPetManager()
    if (petManager) {
      const pets = petManager.getAllPets()
      const targetPet = pets.find((p) => p.id === initialPetId)
      if (targetPet) {
        setSelectedPet(targetPet)
        console.log("Pet selected:", targetPet.pet?.petType)
      }
    }
  }, [isOpen, initialPetId, scene])

  if (!isOpen) return null

  return (
    <ReactModalLayout
      onClose={onClose}
      showBalance={true}
      showEarnings={true}
      titleLogo={true}
    >
      {/* Tabs */}
      <div className="bg-card-dark-3 px-3 py-2 border-b border-muted">
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
            scene={scene}
            onClose={onClose}
          />
        )}

        {activeTab === "tasks" && <TasksTab />}

        {activeTab === "referrals" && <ReferralsTab />}
      </div>
    </ReactModalLayout>
  )
}
