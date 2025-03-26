import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export interface PasswordState {
  password: string;
}

const defaultPassword: PasswordState = {
  password: "",
};

const getInitialPassword = (): PasswordState => {
  if (typeof window !== "undefined") {
    try {
      const storedPassword = sessionStorage.getItem("UserPasswordAutoMark");
      return storedPassword ? JSON.parse(storedPassword) : defaultPassword;
    } catch (error) {
      console.error("Error parsing password from sessionStorage:", error);
    }
  }
  return defaultPassword;
};

const initialState: PasswordState = getInitialPassword();

export const PasswordSlice = createSlice({
  name: "Password",
  initialState,
  reducers: {
    setPassword: (state, action: PayloadAction<PasswordState>) => {
      state.password = action.payload.password;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "UserPasswordAutoMark",
          JSON.stringify(action.payload)
        );
      }
    },
    clearPassword: (state) => {
      state.password = defaultPassword.password;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("UserPasswordAutoMark");
      }
    },
  },
});

export const { setPassword, clearPassword } = PasswordSlice.actions;
export const selectPassword = (state: RootState) => state.Password;

export default PasswordSlice.reducer;
