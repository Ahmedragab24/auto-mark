import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { AllProductsType } from "@/types";

const storedType =
  typeof window !== "undefined"
    ? localStorage.getItem("allProductsType")
    : null;

interface AllProductsTypeState {
  allProductsType: AllProductsType;
}

const initialState: AllProductsTypeState = {
  allProductsType: (storedType as AllProductsType) || "category",
};

export const AllProductsTypeSlice = createSlice({
  name: "AllProductsType",
  initialState,
  reducers: {
    setAllProductsType: (state, action: PayloadAction<AllProductsType>) => {
      state.allProductsType = action.payload;
      localStorage.setItem("allProductsType", action.payload);
    },

    clearAllProductsType: (state) => {
      state.allProductsType = "category";
      localStorage.removeItem("allProductsType");
    },
  },
});

export const { setAllProductsType, clearAllProductsType } =
  AllProductsTypeSlice.actions;

export const selectAllProductsType = (state: RootState) =>
  state.AllProductsType;

export default AllProductsTypeSlice.reducer;
