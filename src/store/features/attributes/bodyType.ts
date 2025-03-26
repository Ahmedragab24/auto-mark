import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface BodyTypeType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: BodyTypeType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const bodyTypeSlice = createSlice({
  name: "BodyType",
  initialState,
  reducers: {
    setBodyType: (state, action: PayloadAction<BodyTypeType>) => {
      return { ...state, ...action.payload };
    },
    clearBodyType: () => initialState,
  },
});

export const { setBodyType, clearBodyType } = bodyTypeSlice.actions;
export const selectBodyType = (state: RootState) => state.BodyType;

export default bodyTypeSlice.reducer;
