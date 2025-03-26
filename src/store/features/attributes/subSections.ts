import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface SubSectionsType {
  id: number | null;
  image: string;
  name: string;
}

const initialState: SubSectionsType = {
  id: null,
  image: "",
  name: "",
};

export const subSectionsSlice = createSlice({
  name: "SubSections",
  initialState,
  reducers: {
    setSubSections: (state, action: PayloadAction<SubSectionsType>) => {
      return { ...state, ...action.payload };
    },
    clearSubSections: () => initialState,
  },
});

export const { setSubSections, clearSubSections } = subSectionsSlice.actions;
export const selectSubSections = (state: RootState) => state.SubSections;

export default subSectionsSlice.reducer;
