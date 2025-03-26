import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { cityType } from "@/types";

interface CityState {
  City: cityType;
}

const initialState: CityState = {
  City: {
    id: null,
    name_ar: "",
    name_en: "",
    country_id: null,
  },
};

export const CitySlice = createSlice({
  name: "City",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<cityType>) => {
      state.City = action.payload;
    },

    clearCity: (state) => {
      state.City = initialState.City;
    },
  },
});

export const { setCity, clearCity } = CitySlice.actions;
export const selectCity = (state: RootState) => state.City;
