import Phaser from "phaser"
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"
import { AUTO } from "phaser"
import { GameScene } from "../GameScene"

export const phaserConfig = (
    parent: HTMLDivElement
): Phaser.Types.Core.GameConfig => {
    return {
        type: AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent,
        transparent: false,
        scene: [
            GameScene,
        ],
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