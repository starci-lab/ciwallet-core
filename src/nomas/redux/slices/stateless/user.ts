import { AuthDB } from "@/nomas/utils/idb"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/nomas/redux"

export interface OwnedItem {
    itemId: string
    itemType: string
    quantity: number
    itemName?: string
}

export interface UserSlice {
    addressWallet: string
    nomToken: number
    isAuthenticated: boolean
    ownedItems: OwnedItem[]
}

const initialState: UserSlice = {
    addressWallet: "",
    nomToken: 10000,
    isAuthenticated: false,
    ownedItems: []
}

export const loadUserFromStorage = createAsyncThunk("user/loadFromStorage", async () => {
    const addressWallet = await AuthDB.getAddressWallet()
    return {
        addressWallet,
        isAuthenticated: Boolean(addressWallet)
    }
})

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
        setOwnedItems: (state, action: PayloadAction<OwnedItem[]>) => {
            state.ownedItems = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
            state.addressWallet = action.payload.addressWallet
            state.isAuthenticated = action.payload.isAuthenticated
        })
    }
})

export const userReducer = userSlice.reducer

export const { setAddressWallet, setNomToken, spendToken, setIsAuthenticated, addToken, setOwnedItems } =
    userSlice.actions

// Selectors
export const selectOwnedItems = (state: RootState) => state.stateless.user.ownedItems
export const selectOwnedItemsByType = (state: RootState, itemType: string) =>
    state.stateless.user.ownedItems.filter((item) => item.itemType === itemType)
