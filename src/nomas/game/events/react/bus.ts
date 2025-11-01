import Phaser from "phaser"
// we define a react bus for communication between react and phaser
export const reactBus = new Phaser.Events.EventEmitter()
