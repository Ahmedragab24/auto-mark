import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface NumOfSeatsType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: NumOfSeatsType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const numOfSeatsSlice = createSlice({
  name: "NumOfSeats",
  initialState,
  reducers: {
    setNumOfSeats: (state, action: PayloadAction<NumOfSeatsType>) => {
      return { ...state, ...action.payload };
    },
    clearNumOfSeats: () => initialState,
  },
});

export const { setNumOfSeats, clearNumOfSeats } = numOfSeatsSlice.actions;
export const selectNumOfSeats = (state: RootState) => state.NumOfSeats;

export default numOfSeatsSlice.reducer;
