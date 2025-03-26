import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface HorsePowerType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: HorsePowerType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const horsePowerSlice = createSlice({
  name: "HorsePower",
  initialState,
  reducers: {
    setHorsePower: (state, action: PayloadAction<HorsePowerType>) => {
      return { ...state, ...action.payload };
    },
    clearHorsePower: () => initialState,
  },
});

export const { setHorsePower, clearHorsePower } = horsePowerSlice.actions;
export const selectHorsePower = (state: RootState) => state.HorsePower;

export default horsePowerSlice.reducer;
