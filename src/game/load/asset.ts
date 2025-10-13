import Phaser from "phaser"

// All assets are now loaded from the public/ folder (served at "/")
const ASSETS_BASE = "/assets/game"
export const loadChogAssets = (scene: Phaser.Scene) => {
  scene.load.atlas(
    "dog-sleep",
    `${ASSETS_BASE}/Chog/chog_sleep.png`,
    `${ASSETS_BASE}/Chog/chog_sleep.json`
  )
  scene.load.atlas(
    "dog-play",
    `${ASSETS_BASE}/Chog/chog_idleplay.png`,
    `${ASSETS_BASE}/Chog/chog_idleplay.json`
  )
  scene.load.atlas(
    "dog-chew",
    `${ASSETS_BASE}/Chog/chog_chew.png`,
    `${ASSETS_BASE}/Chog/chog_chew.json`
  )
  scene.load.atlas(
    "dog-walk",
    `${ASSETS_BASE}/Chog/chog_walk.png`,
    `${ASSETS_BASE}/Chog/chog_walk_animated.json`
  )
}

export const loadZombieAssets = (scene: Phaser.Scene) => {
  scene.load.atlas(
    "zombie-idle",
    `${ASSETS_BASE}/Zombie/zombie_idle.png`,
    `${ASSETS_BASE}/Zombie/zombie_idle.json`
  )
  scene.load.atlas(
    "zombie-walk",
    `${ASSETS_BASE}/Zombie/zombie_walk.png`,
    `${ASSETS_BASE}/Zombie/zombie_walk.json`
  )
  scene.load.atlas(
    "zombie-idleplay",
    `${ASSETS_BASE}/Zombie/zombie_idleplay.png`,
    `${ASSETS_BASE}/Zombie/zombie_idleplay.json`
  )
  scene.load.atlas(
    "zombie-chew",
    `${ASSETS_BASE}/Zombie/zombie_chew.png`,
    `${ASSETS_BASE}/Zombie/zombie_chew.json`
  )
  scene.load.atlas(
    "zombie-sleep",
    `${ASSETS_BASE}/Zombie/zombie_sleep.png`,
    `${ASSETS_BASE}/Zombie/zombie_sleep.json`
  )
}

export const loadKeoneDogAssets = (scene: Phaser.Scene) => {
  scene.load.atlas(
    "keonedog-idle",
    `${ASSETS_BASE}/KeoneDog/keonedog_idle.png`,
    `${ASSETS_BASE}/KeoneDog/keonedog_idle.json`
  )
  scene.load.atlas(
    "keonedog-sleep",
    `${ASSETS_BASE}/KeoneDog/keonedog_sleep.png`,
    `${ASSETS_BASE}/KeoneDog/keonedog_sleep.json`
  )
  scene.load.atlas(
    "keonedog-play",
    `${ASSETS_BASE}/KeoneDog/keonedog_idleplay.png`,
    `${ASSETS_BASE}/KeoneDog/keonedog_idleplay.json`
  )
  scene.load.atlas(
    "keonedog-chew",
    `${ASSETS_BASE}/KeoneDog/keonedog_chew.png`,
    `${ASSETS_BASE}/KeoneDog/keonedog_chew.json`
  )
  scene.load.atlas(
    "keonedog-walk",
    `${ASSETS_BASE}/KeoneDog/keonedog_walk.png`,
    `${ASSETS_BASE}/KeoneDog/keonedog_walk.json`
  )
}

export const loadGhostAssets = (scene: Phaser.Scene) => {
  scene.load.atlas(
    "ghost-idle",
    `${ASSETS_BASE}/Ghost/ghost_idle.png`,
    `${ASSETS_BASE}/Ghost/ghost_idle.json`
  )
  scene.load.atlas(
    "ghost-sleep",
    `${ASSETS_BASE}/Ghost/ghost_sleep.png`,
    `${ASSETS_BASE}/Ghost/ghost_sleep.json`
  )
  scene.load.atlas(
    "ghost-play",
    `${ASSETS_BASE}/Ghost/ghost_idleplay.png`,
    `${ASSETS_BASE}/Ghost/ghost_idleplay.json`
  )
  scene.load.atlas(
    "ghost-chew",
    `${ASSETS_BASE}/Ghost/ghost_chew.png`,
    `${ASSETS_BASE}/Ghost/ghost_chew.json`
  )
  scene.load.atlas(
    "ghost-walk",
    `${ASSETS_BASE}/Ghost/ghost_walk.png`,
    `${ASSETS_BASE}/Ghost/ghost_walk.json`
  )
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
  scene.load.image("game-background", `${ASSETS_BASE}/backgrounds/game-bg.png`)
  scene.load.image("forest-bg", `${ASSETS_BASE}/backgrounds/forest-bg.png`)
}

export const loadFoodAssets = (scene: Phaser.Scene) => {
  scene.load.image("hamburger", `${ASSETS_BASE}/food/hambuger.png`)
}

export const loadPoopAssets = (scene: Phaser.Scene) => {
  // Load animated poop atlas
  scene.load.atlas(
    "poop",
    `${ASSETS_BASE}/poop/poop.png`,
    `${ASSETS_BASE}/poop/poop.json`
  )
}

export const loadCleaningAssets = (scene: Phaser.Scene) => {
  scene.load.image("broom", `${ASSETS_BASE}/broom/broom.png`)
}

export const loadToyAssets = (scene: Phaser.Scene) => {
  scene.load.image("ball", `${ASSETS_BASE}/ball/ball.png`)
}

export const loadEffectAssets = (scene: Phaser.Scene) => {
  scene.load.image("heart", `${ASSETS_BASE}/effects/heart.png`)
  // Use pixel-styled coin sprite instead of effects coin
  scene.load.image("coin", `${ASSETS_BASE}/coin/coin-e4dae5.png`)
}

export const loadUiAssets = (scene: Phaser.Scene) => {
  // Generic setting icon used for both shop and settings buttons per request
  scene.load.image("setting", `${ASSETS_BASE}/game-ui/setting.png`)
  scene.load.image("shop", `${ASSETS_BASE}/game-ui/shop.png`)
  scene.load.image("home", `${ASSETS_BASE}/game-ui/home.png`)
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
