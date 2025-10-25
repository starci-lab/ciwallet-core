import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface MyWalletsSectionSlice {
    hdWalletsAccordionAccountId: string;
}

const initialState: MyWalletsSectionSlice = {
    hdWalletsAccordionAccountId: "",
}

export const myWalletsSectionSlice = createSlice({
    name: "myWalletsSection",
    initialState,
    reducers: {
        setHdWalletsAccordionAccountId: (state, action: PayloadAction<string>) => {
            state.hdWalletsAccordionAccountId = action.payload
        },
    },
})

export const { setHdWalletsAccordionAccountId } = myWalletsSectionSlice.actions
export const myWalletsSectionReducer = myWalletsSectionSlice.reducer