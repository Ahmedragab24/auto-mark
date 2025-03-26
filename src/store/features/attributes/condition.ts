import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface ConditionType {
  id: string;
  name_ar?: string;
  name_en?: string;
  name?: string;
}

const initialState: ConditionType = {
  id: "",
  name: "",
  name_ar: "",
  name_en: "",
};

export const conditionSlice = createSlice({
  name: "Condition",
  initialState,
  reducers: {
    setCondition: (state, action: PayloadAction<ConditionType>) => {
      return { ...state, ...action.payload };
    },
    clearCondition: () => initialState,
  },
});

export const { setCondition, clearCondition } = conditionSlice.actions;
export const selectCondition = (state: RootState) => state.Condition;

export default conditionSlice.reducer;
