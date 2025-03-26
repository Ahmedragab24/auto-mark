import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface ColorType {
  id: number | null;
  name_ar: string;
  name_en: string;
  color_code: string;
  type: string;
}

export interface ColorStateType {
  exterior_color: ColorType;
  interior_color: ColorType;
}

const initialState: ColorStateType = {
  exterior_color: {
    id: null,
    name_ar: "",
    name_en: "",
    color_code: "",
    type: "",
  },
  interior_color: {
    id: null,
    name_ar: "",
    name_en: "",
    color_code: "",
    type: "",
  },
};

export const colorsSlice = createSlice({
  name: "Colors",
  initialState,
  reducers: {
    setColorInterior: (state, action: PayloadAction<ColorStateType>) => {
      return { ...state.interior_color, ...action.payload };
    },
    clearColorInterior: (state) => {
      return { ...state, interior_color: initialState.interior_color };
    },
    setColorExterior: (state, action: PayloadAction<ColorStateType>) => {
      return { ...state.exterior_color, ...action.payload };
    },
    clearColorExterior: (state) => {
      return { ...state, exterior_color: initialState.exterior_color };
    },
  },
});

export const {
  setColorInterior,
  clearColorInterior,
  setColorExterior,
  clearColorExterior,
} = colorsSlice.actions;
export const selectColors = (state: RootState) => state.Colors;

export default colorsSlice.reducer;
