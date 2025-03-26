import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface CurrentPageState {
  currentPage: number;
}

const initialState: CurrentPageState = {
  currentPage: 1,
};

export const CurrentPageSlice = createSlice({
  name: "CurrentPage",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = CurrentPageSlice.actions;
export const selectCurrentPage = (state: RootState) => state.CurrentPage;
