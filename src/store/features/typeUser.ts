import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { TypeUser } from "@/types";

interface TypeUserState {
  TypeUser: TypeUser;
}

const defaultTypeUser: TypeUser = "user";

const getInitialTypeUser = (): TypeUser => {
  if (typeof window !== "undefined") {
    try {
      const storedTypeUser = localStorage.getItem("typeUser");
      return storedTypeUser ? JSON.parse(storedTypeUser) : defaultTypeUser;
    } catch (error) {
      console.error("Error parsing TypeUser from localStorage:", error);
    }
  }
  return defaultTypeUser;
};

const initialState: TypeUserState = {
  TypeUser: getInitialTypeUser(),
};

export const TypeUserSlice = createSlice({
  name: "TypeUser",
  initialState,
  reducers: {
    setTypeUser: (state, action: PayloadAction<TypeUser>) => {
      state.TypeUser = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("typeUser", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setTypeUser } = TypeUserSlice.actions;

export const selectTypeUser = (state: RootState) => state.TypeUser;

export default TypeUserSlice.reducer;
