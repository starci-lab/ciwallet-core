import Phaser from "phaser"

/* eslint-disable @typescript-eslint/no-require-imports */
let browser: typeof import("webextension-polyfill") | null = null

try {
    // Only works when extension is installed
    browser = require("webextension-polyfill")
} catch {
    browser = null
}

const ASSETS_BASE = "/assets/game"
const getUrl = (path: string) => {
    const isExtension = import.meta.env.VITE_APP_ENV === "EXTENSION"
    const _path = `${ASSETS_BASE}/${path}`
    return (isExtension ? browser?.runtime.getURL(_path) : _path) ?? ""
}

// All assets are now loaded from the public/ folder (served at "/")

export const loadChogAssets = (scene: Phaser.Scene) => {
    scene.load.image("chog-avatar", getUrl("Chog/chog.png"))
    scene.load.atlas("dog-sleep", getUrl("Chog/chog_sleep.png"), getUrl("Chog/chog_sleep.json"))
    scene.load.atlas("dog-play", getUrl("Chog/chog_idleplay.png"), getUrl("Chog/chog_idleplay.json"))
    scene.load.atlas("dog-chew", getUrl("Chog/chog_chew.png"), getUrl("Chog/chog_chew.json"))
    scene.load.atlas("dog-walk", getUrl("Chog/chog_walk.png"), getUrl("Chog/chog_walk_animated.json"))
}

export const loadZombieAssets = (scene: Phaser.Scene) => {
    scene.load.image("zombie-avatar", getUrl("Zombie/zombie.png"))
    scene.load.atlas("zombie-idle", getUrl("Zombie/zombie_idle.png"), getUrl("Zombie/zombie_idle.json"))
    scene.load.atlas("zombie-walk", getUrl("Zombie/zombie_walk.png"), getUrl("Zombie/zombie_walk.json"))
    scene.load.atlas("zombie-idleplay", getUrl("Zombie/zombie_idleplay.png"), getUrl("Zombie/zombie_idleplay.json"))
    scene.load.atlas("zombie-chew", getUrl("Zombie/zombie_chew.png"), getUrl("Zombie/zombie_chew.json"))
    scene.load.atlas("zombie-sleep", getUrl("Zombie/zombie_sleep.png"), getUrl("Zombie/zombie_sleep.json"))
}

export const loadKeoneDogAssets = (scene: Phaser.Scene) => {
    scene.load.image("keonedog-avatar", getUrl("KeoneDog/keonedog.png"))
    scene.load.atlas("keonedog-idle", getUrl("KeoneDog/keonedog_idle.png"), getUrl("KeoneDog/keonedog_idle.json"))
    scene.load.atlas("keonedog-sleep", getUrl("KeoneDog/keonedog_sleep.png"), getUrl("KeoneDog/keonedog_sleep.json"))
    scene.load.atlas(
        "keonedog-play",
        getUrl("KeoneDog/keonedog_idleplay.png"),
        getUrl("KeoneDog/keonedog_idleplay.json")
    )
    scene.load.atlas("keonedog-chew", getUrl("KeoneDog/keonedog_chew.png"), getUrl("KeoneDog/keonedog_chew.json"))
    scene.load.atlas("keonedog-walk", getUrl("KeoneDog/keonedog_walk.png"), getUrl("KeoneDog/keonedog_walk.json"))
}

export const loadGhostAssets = (scene: Phaser.Scene) => {
    scene.load.image("ghost-avatar", getUrl("Ghost/ghost.png"))
    scene.load.atlas("ghost-idle", getUrl("Ghost/ghost_idle.png"), getUrl("Ghost/ghost_idle.json"))
    scene.load.atlas("ghost-sleep", getUrl("Ghost/ghost_sleep.png"), getUrl("Ghost/ghost_sleep.json"))
    scene.load.atlas("ghost-play", getUrl("Ghost/ghost_idleplay.png"), getUrl("Ghost/ghost_idleplay.json"))
    scene.load.atlas("ghost-chew", getUrl("Ghost/ghost_chew.png"), getUrl("Ghost/ghost_chew.json"))
    scene.load.atlas("ghost-walk", getUrl("Ghost/ghost_walk.png"), getUrl("Ghost/ghost_walk.json"))
}

// Load all pet assets
export const loadAllPetAssets = (scene: Phaser.Scene) => {
    loadChogAssets(scene)
    loadKeoneDogAssets(scene)
    loadGhostAssets(scene)
    loadZombieAssets(scene)
}

// Load background assets
export const loadBackgroundAssets = (scene: Phaser.Scene) => {
    // Load your custom background image
    scene.load.image("game-background", getUrl("backgrounds/game-bg.png"))
    scene.load.image("forest-bg", getUrl("backgrounds/forest-bg.png"))
}

/**
 * Load a single background asset dynamically if not already loaded
 * @param scene - Phaser scene
 * @param textureKey - Texture key identifier (e.g., "city-bg", "sky-bg")
 * @returns Promise that resolves when asset is loaded
 */
export const loadBackgroundAssetDynamic = (scene: Phaser.Scene, textureKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (scene.textures.exists(textureKey)) {
            resolve()
            return
        }

        // Derive asset path from texture key
        // Texture keys follow pattern: "name-bg" -> "backgrounds/name-bg.png"
        // Handle special case: "game-background" -> "backgrounds/game-bg.png"
        let assetPath: string
        if (textureKey === "game-background") {
            assetPath = getUrl("backgrounds/game-bg.png")
        } else {
            assetPath = getUrl(`backgrounds/${textureKey}.png`)
        }

        // Try to load the asset
        scene.load.image(textureKey, assetPath)

        // Start loading
        scene.load.once("complete", () => {
            if (scene.textures.exists(textureKey)) {
                resolve()
            } else {
                reject(new Error(`Failed to load texture: ${textureKey}`))
            }
        })

        scene.load.once("loaderror", (_file: unknown) => {
            reject(new Error(`Error loading texture: ${textureKey}`))
        })

        scene.load.start()
    })
}

export const loadPoopAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("poop", getUrl("poop/poop.png"), getUrl("poop/poop.json"))
}

export const loadFoodAssets = (scene: Phaser.Scene) => {
    scene.load.image("hamburger", getUrl("food/hambuger.png"))
    scene.load.image("bone", getUrl("food/bone.png"))
    scene.load.image("apple", getUrl("food/apple.png"))
    scene.load.image("coke", getUrl("food/coke.png"))
    scene.load.image("cake", getUrl("food/cake.png"))
    scene.load.image("icecream", getUrl("food/icecream.png"))
    scene.load.image("watermelon", getUrl("food/watermelon.png"))
}

/**
 * Load a single food asset dynamically if not already loaded
 * @param scene - Phaser scene
 * @param foodId - Food identifier (e.g., "hamburger", "apple")
 * @returns Promise that resolves when asset is loaded
 */
export const loadFoodAssetDynamic = (scene: Phaser.Scene, foodId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (scene.textures.exists(foodId)) {
            resolve()
            return
        }

        // Try to load the asset
        const url = getUrl(`food/${foodId.toLowerCase()}.png`)
        scene.load.image(foodId, url)

        // Start loading
        scene.load.once("complete", () => {
            if (scene.textures.exists(foodId)) {
                resolve()
            } else {
                reject(new Error(`Failed to load texture: ${foodId}`))
            }
        })

        scene.load.once("loaderror", (_file: unknown) => {
            reject(new Error(`Error loading texture: ${foodId}`))
        })

        scene.load.start()
    })
}

export const loadCleaningAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("broom", getUrl("clean/broom.png"), getUrl("clean/broom.json"))
}

export const loadToyAssets = (scene: Phaser.Scene) => {
    scene.load.image("ball", getUrl("ball/ball.png"))
    scene.load.image("daruma", getUrl("toy/daruma.png"))
    scene.load.image("tedy", getUrl("toy/tedy.png")) // Fixed: was "teddy" but actual file is "tedy.png"
    scene.load.image("football", getUrl("toy/football.png"))
    scene.load.image("game", getUrl("toy/game.png"))
}

export const loadEffectAssets = (scene: Phaser.Scene) => {
    scene.load.image("heart", getUrl("effects/heart.png"))
    // Use pixel-styled coin sprite instead of effects coin
    scene.load.image("coin", getUrl("coin/coin-e4dae5.png"))
}

export const loadUiAssets = (scene: Phaser.Scene) => {
    // Generic setting icon used for both shop and settings buttons per request
    scene.load.image("setting", getUrl("game-ui/setting.png"))
    scene.load.image("shop", getUrl("game-ui/shop.png"))
    scene.load.image("home", getUrl("game-ui/home.png"))
}

export const loadAllAssets = (scene: Phaser.Scene) => {
    loadAllPetAssets(scene)
    loadBackgroundAssets(scene)
    loadFoodAssets(scene)
    loadPoopAssets(scene)
    loadCleaningAssets(scene)
    loadToyAssets(scene)
    loadEffectAssets(scene)
    loadUiAssets(scene)
}

/**
 * Load a single toy asset dynamically if not already loaded
 * @param scene - Phaser scene
 * @param toyId - Toy identifier (e.g., "ball", "daruma")
 * @returns Promise that resolves when asset is loaded
 */
export const loadToyAssetDynamic = (scene: Phaser.Scene, toyId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (scene.textures.exists(toyId)) {
            resolve()
            return
        }

        // Try to load from toy folder first, then ball folder
        const possiblePaths = [getUrl(`toy/${toyId.toLowerCase()}.png`), getUrl(`ball/${toyId.toLowerCase()}.png`)]

        let currentPathIndex = 0

        const tryLoadNext = () => {
            if (currentPathIndex >= possiblePaths.length) {
                console.warn(`⚠️ Failed to load toy texture from all paths: ${toyId}`)
                reject(new Error(`Failed to load texture: ${toyId}`))
                return
            }

            const url = possiblePaths[currentPathIndex]
            scene.load.image(toyId, url)

            scene.load.once("complete", () => {
                if (scene.textures.exists(toyId)) {
                    resolve()
                } else {
                    currentPathIndex++
                    tryLoadNext()
                }
            })

            scene.load.once("loaderror", () => {
                currentPathIndex++
                tryLoadNext()
            })

            scene.load.start()
        }

        tryLoadNext()
    })
}
