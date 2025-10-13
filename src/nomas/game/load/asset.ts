import Phaser from "phaser"
import backgroundImg from "@/nomas/assets/images/backgrounds/game-bg.png"
import dogSleepImg from "@/nomas/assets/images/Chog/chog_sleep.png"
import dogSleepJson from "@/nomas/assets/images/Chog/chog_sleep.json"
import dogPlayImg from "@/nomas/assets/images/Chog/chog_idleplay.png"
import dogPlayJson from "@/nomas/assets/images/Chog/chog_idleplay.json"
import dogChewImg from "@/nomas/assets/images/Chog/chog_chew.png"
import dogChewJson from "@/nomas/assets/images/Chog/chog_chew.json"
import dogWalkImg from "@/nomas/assets/images/Chog/chog_walk.png"
import dogWalkJson from "@/nomas/assets/images/Chog/chog_walk_animated.json"
// KeoneDog assets (using current path until migration)
import keonedogSleepImg from "@/nomas/assets/images/KeoneDog/keonedog_sleep.png"
import keonedogSleepJson from "@/nomas/assets/images/KeoneDog/keonedog_sleep.json"
import keonedogPlayImg from "@/nomas/assets/images/KeoneDog/keonedog_idleplay.png"
import keonedogPlayJson from "@/nomas/assets/images/KeoneDog/keonedog_idleplay.json"
import keonedogChewImg from "@/nomas/assets/images/KeoneDog/keonedog_chew.png"
import keonedogChewJson from "@/nomas/assets/images/KeoneDog/keonedog_chew.json"
import keonedogWalkImg from "@/nomas/assets/images/KeoneDog/keonedog_walk.png"
import keonedogWalkJson from "@/nomas/assets/images/KeoneDog/keonedog_walk.json"
import keonedogIdleImg from "@/nomas/assets/images/KeoneDog/keonedog_idle.png"
import keonedogIdleJson from "@/nomas/assets/images/KeoneDog/keonedog_idle.json"
// Ghost assets
import ghostSleepImg from "@/nomas/assets/images/Ghost/ghost_sleep.png"
import ghostSleepJson from "@/nomas/assets/images/Ghost/ghost_sleep.json"
import ghostPlayImg from "@/nomas/assets/images/Ghost/ghost_idleplay.png"
import ghostPlayJson from "@/nomas/assets/images/Ghost/ghost_idleplay.json"
import ghostChewImg from "@/nomas/assets/images/Ghost/ghost_chew.png"
import ghostChewJson from "@/nomas/assets/images/Ghost/ghost_chew.json"
import ghostIdleImg from "@/nomas/assets/images/Ghost/ghost_idle.png"
import ghostIdleJson from "@/nomas/assets/images/Ghost/ghost_idle.json"
import ghostWalkImg from "@/nomas/assets/images/Ghost/ghost_walk.png"
import ghostWalkJson from "@/nomas/assets/images/Ghost/ghost_walk.json"

// Zombie assets
import zombieIdleImg from "@/nomas/assets/images/Zombie/zombie_idle.png"
import zombieIdleJson from "@/nomas/assets/images/Zombie/zombie_idle.json"
import zombieWalkImg from "@/nomas/assets/images/Zombie/zombie_walk.png"
import zombieWalkJson from "@/nomas/assets/images/Zombie/zombie_walk.json"
import zombieIdleplayImg from "@/nomas/assets/images/Zombie/zombie_idleplay.png"
import zombieIdleplayJson from "@/nomas/assets/images/Zombie/zombie_idleplay.json"
import zombieChewImg from "@/nomas/assets/images/Zombie/zombie_chew.png"
import zombieChewJson from "@/nomas/assets/images/Zombie/zombie_chew.json"
import zombieSleepImg from "@/nomas/assets/images/Zombie/zombie_sleep.png"
import zombieSleepJson from "@/nomas/assets/images/Zombie/zombie_sleep.json"
import hamburgerImg from "@/nomas/assets/images/food/hambuger.png"

import poopImg from "@/nomas/assets/images/poop/poop.png"
import poopJson from "@/nomas/assets/images/poop/poop.json"
import broomImg from "@/nomas/assets/images/broom/broom.png"
import ballImg from "@/nomas/assets/images/ball/ball.png"
import forestBgImg from "@/nomas/assets/images/backgrounds/forest-bg.png"
import heartImg from "@/nomas/assets/images/effects/heart.png"
import coinPixelImg from "@/nomas/assets/images/coin/coin-e4dae5.png"
import settingImg from "@/nomas/assets/images/game-ui/setting.png"
import shopImg from "@/nomas/assets/images/game-ui/shop.png"
import homeImg from "@/nomas/assets/images/game-ui/home.png"
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
