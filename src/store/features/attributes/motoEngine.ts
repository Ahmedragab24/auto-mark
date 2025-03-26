import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface MotoEngineType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: MotoEngineType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const motoEngineSlice = createSlice({
  name: "MotoEngineType",
  initialState,
  reducers: {
    setMotoEngine: (state, action: PayloadAction<MotoEngineType>) => {
      return { ...state, ...action.payload };
    },
    clearMotoEngine: () => initialState,
  },
});

export const { setMotoEngine, clearMotoEngine } = motoEngineSlice.actions;
export const selectMotoEngine = (state: RootState) => state.MotoEngineType;

export default motoEngineSlice.reducer;
