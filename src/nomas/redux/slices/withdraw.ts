import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ChainId } from "@ciwallet-sdk/types"
import { InitWithdraw } from "./../../components/reusable/pages/WithdrawPage/InitWithdraw/index"
import { SignTransaction } from "./../../components/reusable/pages/WithdrawPage/SignTransaction/index"
import { ProcessTransaction } from "./../../components/reusable/pages/WithdrawPage/ProcessTransaction/index"

export enum WithdrawPageState {
  InitWithdraw,
  SignTransaction,
  ProcessTransaction,
  ResultTransaction,
  ChooseTokenTab
}

export interface WithdrawSlice {
  chainId: ChainId;
  withdrawPage: WithdrawPageState;
}

const initialState: WithdrawSlice = {
    chainId: ChainId.Monad,
    withdrawPage: WithdrawPageState.InitWithdraw,
}

export const withdrawSlice = createSlice({
    name: "withdraw",
    initialState,
    reducers: {
        setWithdrawChainId: (state, action: PayloadAction<ChainId>) => {
            state.chainId = action.payload
        },
        setWithdrawPage: (state, action: PayloadAction<WithdrawPageState>) => {
            state.withdrawPage = action.payload
        },
    },
})

export const withdrawReducer = withdrawSlice.reducer
export const { setWithdrawChainId, setWithdrawPage } = withdrawSlice.actions
