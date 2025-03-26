import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { ServicesSectionType } from "@/types";

export interface ServicesSectionsType {
  id: number | string;
  name_ar: string | null;
  name_en: string | null;
  value?: string | null;
}

const initialState: ServicesSectionType = {
  id: null,
  name_ar: null,
  name_en: null,
  value: null,
};

export const ServicesSectionsSlice = createSlice({
  name: "ServicesSections",
  initialState,
  reducers: {
    setServicesSections: (
      state,
      action: PayloadAction<ServicesSectionType>
    ) => {
      return { ...state, ...action.payload };
    },
    clearServicesSections: () => initialState,
  },
});

export const { setServicesSections, clearServicesSections } =
  ServicesSectionsSlice.actions;
export const selectServicesSections = (state: RootState) =>
  state.ServicesSections;

export default ServicesSectionsSlice.reducer;
