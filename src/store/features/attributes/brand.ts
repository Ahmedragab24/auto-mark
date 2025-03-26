import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface BrandType {
  id: number | null;
  name_ar: string;
  name_en: string;
  category_id: number;
  image: string;
}

const initialState: BrandType = {
  id: null,
  name_ar: "",
  name_en: "",
  category_id: 1,
  image: "",
};

export const brandSlice = createSlice({
  name: "Brand",
  initialState,
  reducers: {
    setBrand: (state, action: PayloadAction<BrandType>) => {
      return { ...state, ...action.payload };
    },
    clearBrand: () => initialState,
  },
});

export const { setBrand, clearBrand } = brandSlice.actions;
export const selectBrand = (state: RootState) => state.Brand;

export default brandSlice.reducer;
