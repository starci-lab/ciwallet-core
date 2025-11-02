import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
export interface CopyAddressSlice {
    filterValue: string
}
const initialState: CopyAddressSlice = {
    filterValue: "",
}
export const copyAddressSlice = createSlice({
    name: "copyAddress",
    initialState,
    reducers: {
        setFilterValue: (state, action: PayloadAction<string>) => {
            state.filterValue = action.payload
        }
    }
})
export const { setFilterValue } = copyAddressSlice.actions
export const copyAddressSectionReducer = copyAddressSlice.reducer