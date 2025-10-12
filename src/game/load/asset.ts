import Phaser from "phaser"
import backgroundImg from "../../../public/assets/game/backgrounds/game-bg.png"
import dogSleepImg from "../../../public/assets/game/Chog/chog_sleep.png"
import dogSleepJson from "../../../public/assets/game/Chog/chog_sleep.json"
import dogPlayImg from "../../../public/assets/game/Chog/chog_idleplay.png"
import dogPlayJson from "../../../public/assets/game/Chog/chog_idleplay.json"
import dogChewImg from "../../../public/assets/game/Chog/chog_chew.png"
import dogChewJson from "../../../public/assets/game/Chog/chog_chew.json"
import dogWalkImg from "../../../public/assets/game/Chog/chog_walk.png"
import dogWalkJson from "../../../public/assets/game/Chog/chog_walk_animated.json"
// KeoneDog assets (using current path until migration)
import keonedogSleepImg from "../../../public/assets/game/KeoneDog/keonedog_sleep.png"
import keonedogSleepJson from "../../../public/assets/game/KeoneDog/keonedog_sleep.json"
import keonedogPlayImg from "../../../public/assets/game/KeoneDog/keonedog_idleplay.png"
import keonedogPlayJson from "../../../public/assets/game/KeoneDog/keonedog_idleplay.json"
import keonedogChewImg from "../../../public/assets/game/KeoneDog/keonedog_chew.png"
import keonedogChewJson from "../../../public/assets/game/KeoneDog/keonedog_chew.json"
import keonedogWalkImg from "../../../public/assets/game/KeoneDog/keonedog_walk.png"
import keonedogWalkJson from "../../../public/assets/game/KeoneDog/keonedog_walk.json"
import keonedogIdleImg from "../../../public/assets/game/KeoneDog/keonedog_idle.png"
import keonedogIdleJson from "../../../public/assets/game/KeoneDog/keonedog_idle.json"
// Ghost assets
import ghostSleepImg from "../../../public/assets/game/Ghost/ghost_sleep.png"
import ghostSleepJson from "../../../public/assets/game/Ghost/ghost_sleep.json"
import ghostPlayImg from "../../../public/assets/game/Ghost/ghost_idleplay.png"
import ghostPlayJson from "../../../public/assets/game/Ghost/ghost_idleplay.json"
import ghostChewImg from "../../../public/assets/game/Ghost/ghost_chew.png"
import ghostChewJson from "../../../public/assets/game/Ghost/ghost_chew.json"
import ghostIdleImg from "../../../public/assets/game/Ghost/ghost_idle.png"
import ghostIdleJson from "../../../public/assets/game/Ghost/ghost_idle.json"
import ghostWalkImg from "../../../public/assets/game/Ghost/ghost_walk.png"
import ghostWalkJson from "../../../public/assets/game/Ghost/ghost_walk.json"

// Zombie assets
import zombieIdleImg from "../../../public/assets/game/Zombie/zombie_idle.png"
import zombieIdleJson from "../../../public/assets/game/Zombie/zombie_idle.json"
import zombieWalkImg from "../../../public/assets/game/Zombie/zombie_walk.png"
import zombieWalkJson from "../../../public/assets/game/Zombie/zombie_walk.json"
import zombieIdleplayImg from "../../../public/assets/game/Zombie/zombie_idleplay.png"
import zombieIdleplayJson from "../../../public/assets/game/Zombie/zombie_idleplay.json"
import zombieChewImg from "../../../public/assets/game/Zombie/zombie_chew.png"
import zombieChewJson from "../../../public/assets/game/Zombie/zombie_chew.json"
import zombieSleepImg from "../../../public/assets/game/Zombie/zombie_sleep.png"
import zombieSleepJson from "../../../public/assets/game/Zombie/zombie_sleep.json"
import hamburgerImg from "../../../public/assets/game/food/hambuger.png"

import poopImg from "../../../public/assets/game/poop/poop.png"
import poopJson from "../../../public/assets/game/poop/poop.json"
import broomImg from "../../../public/assets/game/broom/broom.png"
import ballImg from "../../../public/assets/game/ball/ball.png"
import forestBgImg from "../../../public/assets/game/backgrounds/forest-bg.png"
import heartImg from "../../../public/assets/game/effects/heart.png"
import coinPixelImg from "../../../public/assets/game/coin/coin-e4dae5.png"
import settingImg from "../../../public/assets/game/game-ui/setting.png"
import shopImg from "../../../public/assets/game/game-ui/shop.png"
import homeImg from "../../../public/assets/game/game-ui/home.png"
export const loadChogAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("dog-sleep", dogSleepImg, dogSleepJson)
    scene.load.atlas("dog-play", dogPlayImg, dogPlayJson)
    scene.load.atlas("dog-chew", dogChewImg, dogChewJson)
    scene.load.atlas("dog-walk", dogWalkImg, dogWalkJson)
}

export const loadZombieAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("zombie-idle", zombieIdleImg, zombieIdleJson)
    scene.load.atlas("zombie-walk", zombieWalkImg, zombieWalkJson)
    scene.load.atlas("zombie-idleplay", zombieIdleplayImg, zombieIdleplayJson)
    scene.load.atlas("zombie-chew", zombieChewImg, zombieChewJson)
    scene.load.atlas("zombie-sleep", zombieSleepImg, zombieSleepJson)
}

export const loadKeoneDogAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("keonedog-idle", keonedogIdleImg, keonedogIdleJson)
    scene.load.atlas("keonedog-sleep", keonedogSleepImg, keonedogSleepJson)
    scene.load.atlas("keonedog-play", keonedogPlayImg, keonedogPlayJson)
    scene.load.atlas("keonedog-chew", keonedogChewImg, keonedogChewJson)
    scene.load.atlas("keonedog-walk", keonedogWalkImg, keonedogWalkJson)
}

export const loadGhostAssets = (scene: Phaser.Scene) => {
    scene.load.atlas("ghost-idle", ghostIdleImg, ghostIdleJson)
    scene.load.atlas("ghost-sleep", ghostSleepImg, ghostSleepJson)
    scene.load.atlas("ghost-play", ghostPlayImg, ghostPlayJson)
    scene.load.atlas("ghost-chew", ghostChewImg, ghostChewJson)
    scene.load.atlas("ghost-walk", ghostWalkImg, ghostWalkJson)
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
    scene.load.image("game-background", backgroundImg)
    scene.load.image("forest-bg", forestBgImg)
}

export const loadFoodAssets = (scene: Phaser.Scene) => {
    scene.load.image("hamburger", hamburgerImg)
}

export const loadPoopAssets = (scene: Phaser.Scene) => {
    // Load animated poop atlas
    scene.load.atlas("poop", poopImg, poopJson)
}

export const loadCleaningAssets = (scene: Phaser.Scene) => {
    scene.load.image("broom", broomImg)
}

export const loadToyAssets = (scene: Phaser.Scene) => {
    scene.load.image("ball", ballImg)
}

export const loadEffectAssets = (scene: Phaser.Scene) => {
    scene.load.image("heart", heartImg)
    // Use pixel-styled coin sprite instead of effects coin
    scene.load.image("coin", coinPixelImg)
}

export const loadUiAssets = (scene: Phaser.Scene) => {
    // Generic setting icon used for both shop and settings buttons per request
    scene.load.image("setting", settingImg)
    scene.load.image("shop", shopImg)
    scene.load.image("home", homeImg)
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
