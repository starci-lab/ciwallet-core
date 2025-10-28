/* eslint-disable indent */
import { NomasButton } from "@/nomas/components"
import type { PetData } from "@/nomas/game/managers/PetManager"
import { GameScene } from "@/nomas/game/GameScene"
import { getPetImagePath } from "@/nomas/game/utils/textureUtils"

interface PetStat {
  label: string
  value: number
  max: number
  color: string
}

interface FarmTabProps {
  activePets: PetData[]
  selectedPet: PetData | null
  setSelectedPet: (pet: PetData | null) => void
  scene: GameScene
  onClose: () => void
}

const getPetStats = (pet: PetData | null): PetStat[] => {
  if (!pet) return []

  return [
    {
      label: "Hunger",
      value: pet.feedingSystem.hungerLevel,
      max: 100,
      color: "#8B5CF6",
    },
    {
      label: "Cleanliness",
      value: pet.cleanlinessSystem.cleanlinessLevel,
      max: 100,
      color: "#06B6D4",
    },
    {
      label: "Happiness",
      value: pet.happinessSystem.happinessLevel,
      max: 100,
      color: "#F59E0B",
    },
  ]
}

export function FarmTab({
  activePets,
  selectedPet,
  setSelectedPet,
  scene,
  onClose,
}: FarmTabProps) {
  const openShop = () => {
    scene.events.emit("open-react-shop")
    onClose()
  }

  return (
    <div className="p-4 space-y-4">
      {/* Selected Pet Details */}
      {selectedPet && (
        <div className="bg-[#2a2a2a] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                <img
                  src={getPetImagePath(selectedPet.pet?.petType || "chog")}
                  alt={selectedPet.pet?.petType}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white capitalize">
                  {selectedPet.pet?.petType || "Unnamed Pet"}
                </h3>
                <p className="text-sm text-gray-400 capitalize">
                  Lv 1 • {selectedPet.pet?.petType || "Unknown"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPet(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Real-time Stats */}
          <div className="space-y-2">
            {getPetStats(selectedPet).map((stat) => (
              <div key={stat.value}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-white capitalize">
                    <span className="text-gray-400 capitalize">
                      {stat.label}:
                    </span>{" "}
                    {Math.round(stat.value)}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((stat.value / stat.max) * 100, 100)}%`,
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pets Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Your Pets ({activePets.length})
        </h3>

        {activePets.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {activePets.map((pet, index) => (
              <button
                key={pet.id || index}
                onClick={() => setSelectedPet(pet)}
                className={`relative p-4 rounded-xl bg-[#2a2a2a] border-2 transition-all ${
                  selectedPet?.id === pet.id
                    ? "border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20"
                    : "border-transparent hover:border-[rgba(135,135,135,0.5)]"
                }`}
              >
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1a1a1a] rounded-full text-xs text-white font-semibold">
                  Lv 1
                </div>
                <div className="w-full h-20 flex items-center justify-center mb-2 mt-4">
                  <img
                    src={getPetImagePath(pet.pet?.petType || "chog")}
                    alt={pet.pet?.petType}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-sm">🔥</span>
                  <span className="text-sm font-semibold text-white">
                    {Math.round(pet.feedingSystem.hungerLevel)}
                  </span>
                </div>
                <div className="text-xs text-gray-300 truncate">
                  {pet.pet?.petType || `Pet ${index + 1}`}
                </div>
              </button>
            ))}

            {/* Add New Pet Button */}
            <button
              onClick={openShop}
              className="p-4 rounded-xl bg-[#2a2a2a] border-2 border-dashed border-[rgba(135,135,135,0.3)] hover:border-[rgba(135,135,135,0.6)] transition-all flex items-center justify-center min-h-[140px]"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">➕</div>
                <div className="text-xs text-gray-400">Add Pet</div>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Pets Yet!
            </h3>
            <p className="text-gray-400 mb-6">
              Get your first pet from the shop
            </p>
            <NomasButton
              onClick={openShop}
              className="bg-linear-to-r from-purple-500 to-pink-500"
            >
              🛒 Visit Shop
            </NomasButton>
          </div>
        )}
      </div>
    </div>
  )
}
