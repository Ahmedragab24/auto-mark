import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface SpecificType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: SpecificType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const specificSlice = createSlice({
  name: "Specific",
  initialState,
  reducers: {
    setSpecific: (state, action: PayloadAction<SpecificType>) => {
      return { ...state, ...action.payload };
    },
    clearSpecific: () => initialState,
  },
});

export const { setSpecific, clearSpecific } = specificSlice.actions;
export const selectSpecific = (state: RootState) => state.Specific;

export default specificSlice.reducer;
