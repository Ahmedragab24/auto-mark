import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { TypeAdvertisementType } from "@/types";

interface TypeAdvertisementState {
  typeAdvertisement: TypeAdvertisementType;
}

const defaultTypeAdvertisement: TypeAdvertisementType = "car";

const getInitialTypeAdvertisement = (): TypeAdvertisementType => {
  if (typeof window !== "undefined") {
    const storedTypeAdvertisement = localStorage.getItem("typeAdvertisement");
    if (storedTypeAdvertisement) {
      const parsed = JSON.parse(
        storedTypeAdvertisement
      ) as TypeAdvertisementType;
      return parsed;
    }
  }
  return defaultTypeAdvertisement;
};

const initialState: TypeAdvertisementState = {
  typeAdvertisement: getInitialTypeAdvertisement(),
};

export const TypeAdvertisementSlice = createSlice({
  name: "TypeAdvertisement",
  initialState,
  reducers: {
    setTypeAdvertisement: (
      state,
      action: PayloadAction<TypeAdvertisementType>
    ) => {
      state.typeAdvertisement = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "typeAdvertisement",
          JSON.stringify(action.payload)
        );
      }
    },
  },
});

export const { setTypeAdvertisement } = TypeAdvertisementSlice.actions;

export const selectTypeAdvertisement = (state: RootState) =>
  state.TypeAdvertisement;

export default TypeAdvertisementSlice.reducer;
