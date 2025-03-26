import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface FuelType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: FuelType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const fuelSlice = createSlice({
  name: "FuelType",
  initialState,
  reducers: {
    setFuel: (state, action: PayloadAction<FuelType>) => {
      return { ...state, ...action.payload };
    },
    clearFuel: () => initialState,
  },
});

export const { setFuel, clearFuel } = fuelSlice.actions;
export const selectFuel = (state: RootState) => state.FuelType;

export default fuelSlice.reducer;
