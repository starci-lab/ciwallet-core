import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SceneSlice {
  scene: Scene
}

export enum Scene {
  Init = "init",
  Main = "main",
  Game = "game",
}

const initialState: SceneSlice = {
    // scene: Scene.Init,
    scene: Scene.Game,
}

export const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        setScene: (state, action: PayloadAction<Scene>) => {
            state.scene = action.payload
        },
    },
})

export const { setScene } = sceneSlice.actions

export const sceneReducer = sceneSlice.reducer
