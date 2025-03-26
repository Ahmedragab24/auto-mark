import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface WeightType {
  number: number | null;
}

const initialState: WeightType = {
  number: null,
};

export const weightSlice = createSlice({
  name: "Weight",
  initialState,
  reducers: {
    setWeight: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
    clearWeight: () => initialState,
  },
});

export const { setWeight, clearWeight } = weightSlice.actions;
export const selectWeight = (state: RootState) => state.Weight;

export default weightSlice.reducer;
