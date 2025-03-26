import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface NumOfCylindersType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: NumOfCylindersType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const numOfCylindersSlice = createSlice({
  name: "NumOfCylinders",
  initialState,
  reducers: {
    setNumOfCylinders: (state, action: PayloadAction<NumOfCylindersType>) => {
      return { ...state, ...action.payload };
    },
    clearNumOfCylinders: () => initialState,
  },
});

export const { setNumOfCylinders, clearNumOfCylinders } =
  numOfCylindersSlice.actions;
export const selectNumOfCylinders = (state: RootState) => state.NumOfCylinders;

export default numOfCylindersSlice.reducer;
