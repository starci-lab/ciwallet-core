/**
 * Simple helper to get pet image URL (direct path method)
 * Use this if Phaser scene is not available or for simpler cases
 */
export const getPetImagePath = (petType: string): string => {
    const normalizedType = petType?.toLowerCase() || "chog"

    const petAssetMap: Record<string, string> = {
        keonedog: "/assets/game/KeoneDog/keonedog.png",
        ghost: "/assets/game/Ghost/ghost.png",
        zombie: "/assets/game/Zombie/zombie.png",
        chog: "/assets/game/Chog/chog.png",
        bird: "/assets/game/Bird/bird.png"
    }

    for (const [key, path] of Object.entries(petAssetMap)) {
        if (normalizedType.includes(key)) {
            return path
        }
    }

    return petAssetMap.chog
}
