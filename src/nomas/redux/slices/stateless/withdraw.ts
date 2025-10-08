import { ChainManager, TokenManager } from "@ciwallet-sdk/classes"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId } from "@ciwallet-sdk/types"

export interface WithdrawSlice {
  tokenManager: TokenManager
  chainManager: ChainManager
  chainId: ChainId
}
const initialState: WithdrawSlice = {
  tokenManager: new TokenManager(),
  chainManager: new ChainManager(),
  chainId: ChainId.Monad,
}

export const withdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenManager>) => {
      state.tokenManager = action.payload
    },
    setChainId: (state, action: PayloadAction<ChainId>) => {
      state.chainId = action.payload
    },
  },
})

export const { setToken: setTokenWithdraw, setChainId: setChainIdWithdraw } = withdrawSlice.actions

export const withdrawReducer = withdrawSlice.reducer
