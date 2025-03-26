import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { CategoryCarsType } from "@/types";

const storedCategory =
  typeof window !== "undefined" ? localStorage.getItem("Categories") : null;

const parsedCategory: CategoryCarsType | null = storedCategory
  ? JSON.parse(storedCategory)
  : null;

interface CategoriesState {
  Categories: CategoryCarsType;
}

const initialState: CategoriesState = {
  Categories: parsedCategory || {
    id: 1,
    key: "car",
    name: "سيارات",
  },
};

export const CategoriesSlice = createSlice({
  name: "Categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryCarsType>) => {
      state.Categories = action.payload;
      localStorage.setItem("Categories", JSON.stringify(action.payload));
    },
  },
});

export const { setCategories } = CategoriesSlice.actions;
export const selectCategories = (state: RootState) => state.Categories;

export default CategoriesSlice.reducer;
