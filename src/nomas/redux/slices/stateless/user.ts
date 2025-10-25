import { AuthDB } from "@/nomas/utils/idb"
import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

export interface UserSlice {
  addressWallet: string
  nomToken: number
  isAuthenticated: boolean
}

const initialState: UserSlice = {
    addressWallet: "",
    nomToken: 10000,
    isAuthenticated: false,
}

export const loadUserFromStorage = createAsyncThunk(
    "user/loadFromStorage",
    async () => {
        const addressWallet = await AuthDB.getAddressWallet()
        console.log("addressWallet", addressWallet)
        return {
            addressWallet,
            isAuthenticated: Boolean(addressWallet),
        }
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAddressWallet: (state, action: PayloadAction<string>) => {
            state.addressWallet = action.payload
        },
        setNomToken: (state, action: PayloadAction<number>) => {
            state.nomToken = action.payload
        },
        spendToken: (state, action: PayloadAction<number>) => {
            const amount = action.payload
            if (state.nomToken >= amount) {
                state.nomToken = state.nomToken - amount
            }
        },
        addToken: (state, action: PayloadAction<number>) => {
            state.nomToken = state.nomToken + action.payload
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
            state.addressWallet = action.payload.addressWallet
            state.isAuthenticated = action.payload.isAuthenticated
        })
    },
})

export const userReducer = userSlice.reducer

export const {
    setAddressWallet,
    setNomToken,
    spendToken,
    setIsAuthenticated,
    addToken,
} = userSlice.actions
