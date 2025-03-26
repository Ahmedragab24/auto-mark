import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface PowerTransSysType {
  id: number | string;
  name: string | null;
  name_ar: string | null;
  name_en: string | null;
}

const initialState: PowerTransSysType = {
  id: "",
  name: null,
  name_ar: null,
  name_en: null,
};

export const powerTransSysSlice = createSlice({
  name: "PowerTransSysType",
  initialState,
  reducers: {
    setPowerTransSys: (state, action: PayloadAction<PowerTransSysType>) => {
      return { ...state, ...action.payload };
    },
    clearPowerTransSys: () => initialState,
  },
});

export const { setPowerTransSys, clearPowerTransSys } =
  powerTransSysSlice.actions;
export const selectPowerTransSys = (state: RootState) =>
  state.PowerTransSysType;

export default powerTransSysSlice.reducer;
