import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface MileageType {
  number: number | null;
}

const initialState: MileageType = {
  number: null,
};

export const mileageSlice = createSlice({
  name: "Mileage",
  initialState,
  reducers: {
    setMileage: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
    clearMileage: () => initialState,
  },
});

export const { setMileage, clearMileage } = mileageSlice.actions;
export const selectMileage = (state: RootState) => state.Mileage;

export default mileageSlice.reducer;
