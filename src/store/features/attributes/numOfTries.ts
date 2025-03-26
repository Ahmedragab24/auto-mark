import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface NumOfTriesType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: NumOfTriesType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const numOfTriesSlice = createSlice({
  name: "NumOfTries",
  initialState,
  reducers: {
    setNumOfTries: (state, action: PayloadAction<NumOfTriesType>) => {
      return { ...state, ...action.payload };
    },
    clearNumOfTries: () => initialState,
  },
});

export const { setNumOfTries, clearNumOfTries } = numOfTriesSlice.actions;
export const selectNumOfTries = (state: RootState) => state.NumOfTries;

export default numOfTriesSlice.reducer;
