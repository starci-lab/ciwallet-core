import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TokenId, UnifiedTokenId } from "@ciwallet-sdk/types"

export interface DynamicSlice {
    prices: Partial<Record<TokenId, number>>;
    balances: Partial<Record<TokenId, number>>;
    unifiedPrices: Partial<Record<UnifiedTokenId, number>>;
}

const initialState: DynamicSlice = {
    prices: {},
    balances: {},
    unifiedPrices: {},
}

export interface SetPricePayload {
    tokenId: TokenId;
    price: number;
}

export interface SetBalancePayload {
    tokenId: TokenId;
    balance: number;
}

export interface SetUnifiedPricePayload {
    unifiedTokenId: UnifiedTokenId;
    price: number;
}

export const dynamicSlice = createSlice({
    name: "dynamic",
    initialState,
    reducers: {
        setPrice: (state, action: PayloadAction<SetPricePayload>) => {
            state.prices[action.payload.tokenId] = action.payload.price
        },
        setBalance: (state, action: PayloadAction<SetBalancePayload>) => {
            state.balances[action.payload.tokenId] = action.payload.balance
        },
        setUnifiedPrice: (state, action: PayloadAction<SetUnifiedPricePayload>) => {
            state.unifiedPrices[action.payload.unifiedTokenId] = action.payload.price
        },
    },
})

export const { setPrice, setBalance, setUnifiedPrice } = dynamicSlice.actions
export const dynamicReducer = dynamicSlice.reducer