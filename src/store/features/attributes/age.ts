import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface AgeType {
  number: number | null;
}

const initialState: AgeType = {
  number: null,
};

export const ageSlice = createSlice({
  name: "Age",
  initialState,
  reducers: {
    setAge: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
    clearAge: () => initialState,
  },
});

export const { setAge, clearAge } = ageSlice.actions;
export const selectAge = (state: RootState) => state.Age;

export default ageSlice.reducer;
