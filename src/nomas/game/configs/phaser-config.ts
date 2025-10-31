import Phaser from "phaser"
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"
import { AUTO } from "phaser"
import { GameScene } from "../GameScene"

export const phaserConfig = (
  parent: HTMLDivElement
): Phaser.Types.Core.GameConfig => {
  // Get container dimensions to ensure proper sizing
  const containerRect = parent.getBoundingClientRect()
  const containerWidth = containerRect.width || window.innerWidth
  // Use full screen height for game, container will control display size
  const containerHeight = window.innerHeight

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
  }
}
