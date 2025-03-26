import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface BrandNameType {
  name: string;
}

const initialState: BrandNameType = {
  name: "",
};

export const brandNameSlice = createSlice({
  name: "BrandName",
  initialState,
  reducers: {
    setBrandName: (state, action: PayloadAction<BrandNameType>) => {
      return { ...state, ...action.payload };
    },
    clearBrandName: () => initialState,
  },
});

export const { setBrandName, clearBrandName } = brandNameSlice.actions;
export const selectBrandName = (state: RootState) => state.BrandName;

export default brandNameSlice.reducer;
