import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface EngineCountType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: EngineCountType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const engineCountSlice = createSlice({
  name: "EngineCount",
  initialState,
  reducers: {
    setEngineCount: (state, action: PayloadAction<EngineCountType>) => {
      return { ...state, ...action.payload };
    },
    clearEngineCount: () => initialState,
  },
});

export const { setEngineCount, clearEngineCount } = engineCountSlice.actions;
export const selectEngineCount = (state: RootState) => state.EngineCount;

export default engineCountSlice.reducer;
