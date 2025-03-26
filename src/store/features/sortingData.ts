import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { sort_byType } from "@/types";

interface SortingType {
  sort_by: sort_byType | null;
}

const initialState: SortingType = {
  sort_by: null,
};

export const sortingSlice = createSlice({
  name: "Sorting",
  initialState,
  reducers: {
    setSorting: (state, action: PayloadAction<sort_byType>) => {
      state.sort_by = action.payload;
    },

    resetSorting: (state) => {
      state.sort_by = null;
    },
  },
});

export const { setSorting, resetSorting } = sortingSlice.actions;
export const selectSorting = (state: RootState) => state.Sorting;

export default sortingSlice.reducer;
