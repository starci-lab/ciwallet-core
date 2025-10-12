import { getAddressWalletFromLS } from "@/nomas/modules/utils/auth"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UserSlice {
  addressWallet: string
  nomToken: number
  isAuthenticated: boolean
}

const initialState: UserSlice = {
    addressWallet: getAddressWalletFromLS(),
    nomToken: 10000,
    isAuthenticated: Boolean(getAddressWalletFromLS()),
}

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
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload
        },
    },
})

export const userReducer = userSlice.reducer

export const { setAddressWallet, setNomToken, spendToken, setIsAuthenticated } =
  userSlice.actions
