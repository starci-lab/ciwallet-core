import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SceneSlice {
  scene: Scene
  draggable: boolean
}

export enum Scene {
  Init = "init",
  Main = "main",
  Settings = "settings",
  MyWallets = "my-wallets",
  CopyAddress = "copy-address",
}

const initialState: SceneSlice = {
    // scene: Scene.Init,
    scene: Scene.Init,
    draggable: true,
}

export const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        setScene: (state, action: PayloadAction<Scene>) => {
            state.scene = action.payload
        },
        setDraggable: (state, action: PayloadAction<boolean>) => {
            state.draggable = action.payload
        },
    },
})

export const { setScene, setDraggable } = sceneSlice.actions

export const sceneReducer = sceneSlice.reducer
