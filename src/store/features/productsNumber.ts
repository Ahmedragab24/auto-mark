import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ProductsNumberState {
  productsNumber: number;
}

const initialState: ProductsNumberState = {
  productsNumber: 0,
};

export const productsNumberSlice = createSlice({
  name: "productsNumber",
  initialState,
  reducers: {
    setProductsNumber: (state, action: PayloadAction<number>) => {
      state.productsNumber = action.payload;
    },
  },
});

export const { setProductsNumber } = productsNumberSlice.actions;

export const selectProductsNumber = (state: RootState) => state.productsNumber;
export default productsNumberSlice.reducer;
