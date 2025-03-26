import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface ModelNameType {
  name: string;
}

const initialState: ModelNameType = {
  name: "",
};

export const modelNameSlice = createSlice({
  name: "Model",
  initialState,
  reducers: {
    setModelName: (state, action: PayloadAction<ModelNameType>) => {
      return { ...state, ...action.payload };
    },
    clearModelName: () => initialState,
  },
});

export const { setModelName, clearModelName } = modelNameSlice.actions;
export const selectModel = (state: RootState) => state.ModelName;

export default modelNameSlice.reducer;
