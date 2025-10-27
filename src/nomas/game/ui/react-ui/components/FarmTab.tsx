/* eslint-disable indent */
import { NomasButton } from "@/nomas/components"
import type { PetData } from "@/nomas/game/managers/PetManager"
import { GameScene } from "@/nomas/game/GameScene"

interface PetStat {
  label: string
  value: number
  max: number
  icon: string
  color: string
}

interface FarmTabProps {
  activePets: PetData[]
  selectedPet: PetData | null
  setSelectedPet: (pet: PetData | null) => void
  scene: GameScene
  onClose: () => void
}

const getPetIcon = (pet: PetData) => {
  const petType = pet.pet?.petType || ""
  if (petType.includes("dog")) return "🐕"
  if (petType.includes("cat")) return "🐱"
  if (petType.includes("chog")) return "🦀"
  if (petType.includes("ghost")) return "👻"
  if (petType.includes("zombie")) return "🧟"
  return "🐾"
}

const getPetStats = (pet: PetData | null): PetStat[] => {
  if (!pet) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedingSystem = pet.feedingSystem as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const happinessSystem = pet.happinessSystem as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanlinessSystem = pet.cleanlinessSystem as any

  return [
    {
      label: "Hunger",
      value: feedingSystem?.hunger || 0,
      max: 100,
      icon: "🍖",
      color: "#ff6b6b",
    },
    {
      label: "Happiness",
      value: happinessSystem?.happiness || 0,
      max: 100,
      icon: "😊",
      color: "#ffd93d",
    },
    {
      label: "Cleanliness",
      value: cleanlinessSystem?.cleanliness || 0,
      max: 100,
      icon: "✨",
      color: "#6bcbff",
    },
    {
      label: "Energy",
      value: 100, // Energy not tracked yet
      max: 100,
      icon: "⚡",
      color: "#a3ff6b",
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
              <div className="text-4xl">{getPetIcon(selectedPet)}</div>
              <div>
                <h3 className="text-lg font-bold text-white">
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
              <div key={stat.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-gray-300">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </span>
                  <span className="font-semibold text-white">
                    {Math.round(stat.value)}/{stat.max}
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

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={openShop}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-lg">
                🍖
              </div>
              <span className="text-xs text-gray-400">Feed</span>
            </button>
            <button
              onClick={openShop}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-lg">
                🧹
              </div>
              <span className="text-xs text-gray-400">Clean</span>
            </button>
            <button
              onClick={openShop}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-lg">
                🎾
              </div>
              <span className="text-xs text-gray-400">Play</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-lg">
                👕
              </div>
              <span className="text-xs text-gray-400">Wear</span>
            </button>
          </div>

          {/* Upgrade Button */}
          <NomasButton
            className="w-full bg-white text-black hover:bg-gray-200"
            xlSize
          >
            ⚡ Upgrade
          </NomasButton>
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
                <div className="text-5xl mb-2 mt-4">{getPetIcon(pet)}</div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-sm">🔥</span>
                  <span className="text-sm font-semibold text-white">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {Math.round((pet.feedingSystem as any)?.hunger || 0)}
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
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              🛒 Visit Shop
            </NomasButton>
          </div>
        )}
      </div>
    </div>
  )
}
