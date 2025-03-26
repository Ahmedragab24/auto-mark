import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Address {
  id: string;
  country_en: string;
  country_ar: string;
  city_en: string;
  city_ar: string;
  address: string;
  iso_code: string;
  phone: string;
}

// Initialize state safely with localStorage check
const initialState: Address[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const storedAddresses = localStorage.getItem("UserAddressAutoMark");
      return storedAddresses ? JSON.parse(storedAddresses) : [];
    } catch (error) {
      console.error("Error parsing addresses from localStorage:", error);
      return [];
    }
  }
  return [];
})();

export const AddressSlice = createSlice({
  name: "Address",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<Address>) => {
      state.push(action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("UserAddressAutoMark", JSON.stringify(state));
      }
    },

    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.findIndex((addr) => addr.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("UserAddressAutoMark", JSON.stringify(state));
        }
      }
    },

    // Fixed clearAddress reducer
    clearAddress: (state, action: PayloadAction<string>) => {
      const filteredState = state.filter((addr) => addr.id !== action.payload);
      // Replace the entire state with the filtered state
      state.length = 0;
      state.push(...filteredState);

      if (typeof window !== "undefined") {
        localStorage.setItem("UserAddressAutoMark", JSON.stringify(state));
      }
    },

    clearAllAddress: (state) => {
      state.length = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("UserAddressAutoMark");
      }
    },
  },
});

export const { setAddress, clearAddress, clearAllAddress, updateAddress } =
  AddressSlice.actions;

export const selectAddress = (state: RootState) => state.Address;

export default AddressSlice.reducer;
