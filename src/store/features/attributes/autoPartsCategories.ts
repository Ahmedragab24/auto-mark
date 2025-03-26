import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface AutoPartsCategoriesType {
  id: number | null;
  name_ar: string;
  name_en: string;
}

const initialState: AutoPartsCategoriesType = {
  id: null,
  name_ar: "",
  name_en: "",
};

export const autoPartsCategoriesSlice = createSlice({
  name: "AutoPartsCategories",
  initialState,
  reducers: {
    setAutoPartsCategories: (
      state,
      action: PayloadAction<AutoPartsCategoriesType>
    ) => {
      return { ...state, ...action.payload };
    },
    clearAutoPartsCategories: () => initialState,
  },
});

export const { setAutoPartsCategories, clearAutoPartsCategories } =
  autoPartsCategoriesSlice.actions;
export const selectAutoPartsCategories = (state: RootState) =>
  state.AutoPartsCategories;

export default autoPartsCategoriesSlice.reducer;
