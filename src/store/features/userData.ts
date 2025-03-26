import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { UserDataType } from "@/types";

export interface UserDataState {
  token: string;
  user: UserDataType;
}

const defaultUserData: UserDataState = {
  token: "",
  user: {
    id: null,
    name: "",
    city: null,
    country: null,
    device_id: null,
    email: null,
    fcm: null,
  },
};

const getInitialUserData = (): UserDataState => {
  if (typeof window !== "undefined") {
    try {
      const storedUserData = sessionStorage.getItem("userDataAutoMark");
      return storedUserData ? JSON.parse(storedUserData) : defaultUserData;
    } catch (error) {
      console.error("Error parsing userData from sessionStorage:", error);
    }
  }
  return defaultUserData;
};

const initialState: UserDataState = getInitialUserData();

export const UserDataSlice = createSlice({
  name: "UserData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "userDataAutoMark",
          JSON.stringify(action.payload)
        );
      }
    },
    clearUserData: (state) => {
      state.token = defaultUserData.token;
      state.user = defaultUserData.user;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userDataAutoMark");
      }
    },
  },
});

export const { setUserData, clearUserData } = UserDataSlice.actions;
export const selectUserData = (state: RootState) => state.UserData.user;

export default UserDataSlice.reducer;
