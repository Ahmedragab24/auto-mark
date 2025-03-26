import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface AutoPartsType {
  id: number | null;
  name_ar: string;
  name_en: string;
}

const initialState: AutoPartsType = {
  id: null,
  name_ar: "",
  name_en: "",
};

export const autoPartsSlice = createSlice({
  name: "AutoParts",
  initialState,
  reducers: {
    setAutoParts: (state, action: PayloadAction<AutoPartsType>) => {
      return { ...state, ...action.payload };
    },
    clearAutoParts: () => initialState,
  },
});

export const { setAutoParts, clearAutoParts } = autoPartsSlice.actions;
export const selectAutoParts = (state: RootState) => state.AutoParts;

export default autoPartsSlice.reducer;
