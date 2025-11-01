import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface GameSlice {
    gameLoaded: boolean;
}

const initialState: GameSlice = {
    gameLoaded: false,
}

export const gameSlice = createSlice({
    name: "gameSection",
    initialState,
    reducers: {
        setGameLoaded: (state, action: PayloadAction<boolean>) => {
            state.gameLoaded = action.payload
        },
    },
})

export const { setGameLoaded } = gameSlice.actions
export const gameReducer = gameSlice.reducer