/* eslint-disable indent */
import Phaser from "phaser"
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"
import { AUTO } from "phaser"
import { GameScene } from "../GameScene"

const GAME_HEIGHT = 140

export const phaserConfig = (
  parent: HTMLDivElement
): Phaser.Types.Core.GameConfig => {
  // Get container dimensions to ensure proper sizing
  const containerRect = parent.getBoundingClientRect()
  const containerWidth = containerRect.width || window.innerWidth
  // Use full screen height for game, container will control display size
  // const containerHeight = window.innerHeight
  const containerHeight = GAME_HEIGHT

  return {
    type: AUTO,
    width: containerWidth,
    height: containerHeight,
    parent,
    transparent: true,
    scene: GameScene,
    plugins: {
      scene: [
        {
          key: "rexUI",
          plugin: RexUIPlugin,
          mapping: "rexUI",
        },
      ],
    },
    scale: {
      mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT, // Scale width, maintain aspect ratio
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
  }
}
