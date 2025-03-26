import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface HeightType {
  number: number | null;
}

const initialState: HeightType = {
  number: null,
};

export const heightSlice = createSlice({
  name: "Height",
  initialState,
  reducers: {
    setHeight: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
    clearHeight: () => initialState,
  },
});

export const { setHeight, clearHeight } = heightSlice.actions;
export const selectHeight = (state: RootState) => state.Height;

export default heightSlice.reducer;
