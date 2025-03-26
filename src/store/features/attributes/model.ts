import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface ModelsType {
  id: number | null;
  name_ar: string;
  name_en: string;
  brand_id: number;
}

const initialState: ModelsType = {
  id: null,
  name_ar: "",
  name_en: "",
  brand_id: 1,
};

export const modelSlice = createSlice({
  name: "Model",
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<ModelsType>) => {
      return { ...state, ...action.payload };
    },
    clearModel: () => initialState,
  },
});

export const { setModel, clearModel } = modelSlice.actions;
export const selectModel = (state: RootState) => state.Model;

export default modelSlice.reducer;
