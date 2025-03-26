import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface YearType {
  id: number | string | null;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  value?: string | null;
}

const initialState: YearType = {
  id: null,
  name: null,
  name_ar: null,
  name_en: null,
  value: null,
};

export const yearSlice = createSlice({
  name: "Year",
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<YearType>) => {
      return { ...state, ...action.payload };
    },
    clearYear: () => initialState,
  },
});

export const { setYear, clearYear } = yearSlice.actions;
export const selectYear = (state: RootState) => state.Year;

export default yearSlice.reducer;
