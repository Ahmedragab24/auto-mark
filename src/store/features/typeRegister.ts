import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { TypeRegister } from "@/types";

interface TypeRegisterState {
  typeRegister: TypeRegister;
}

const defaultTypeRegister: TypeRegister = "user";

const getInitialTypeRegister = (): TypeRegister => {
  if (typeof window !== "undefined") {
    try {
      const storedTypeRegister = localStorage.getItem("typeRegister");
      return storedTypeRegister
        ? JSON.parse(storedTypeRegister)
        : defaultTypeRegister;
    } catch (error) {
      console.error("Error parsing typeRegister from localStorage:", error);
    }
  }
  return defaultTypeRegister;
};

const initialState: TypeRegisterState = {
  typeRegister: getInitialTypeRegister(),
};

export const TypeRegisterSlice = createSlice({
  name: "TypeRegister",
  initialState,
  reducers: {
    setTypeRegister: (state, action: PayloadAction<TypeRegister>) => {
      state.typeRegister = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("typeRegister", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setTypeRegister } = TypeRegisterSlice.actions;

export const selectTypeRegister = (state: RootState) => state.TypeRegister;

export default TypeRegisterSlice.reducer;
