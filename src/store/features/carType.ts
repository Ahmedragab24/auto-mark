import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { CategoryCarsType } from "@/types";

interface CarTypeState {
  Categories: CategoryCarsType;
}

const initialState: CarTypeState = {
  Categories: {
    id: 1,
    key: "car",
    name: "",
  },
};

export const CarTypeSlice = createSlice({
  name: "CarType",
  initialState,
  reducers: {
    setCarType: (state, action: PayloadAction<CategoryCarsType>) => {
      state.Categories = action.payload;
    },
  },
});

export const { setCarType } = CarTypeSlice.actions;
export const selectCarType = (state: RootState) => state.CarType;

export default CarTypeSlice.reducer;
