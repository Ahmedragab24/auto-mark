import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { cityType, countryType } from "@/types";

interface AdvertisementState {
  name: string;
  phone: string;
  iso_code: string;
  address: string;
  country: countryType;
  city: cityType;
  codeImage: string;
  whatsappPreferred: boolean;
  featured: boolean;
  latitude: number | string;
  longitude: number | string;
}

const initialState: AdvertisementState = {
  name: "",
  phone: "",
  iso_code: "+971",
  address: "",
  country: {
    id: 1,
    name_ar: "",
    name_en: "",
  },
  city: {
    id: 1,
    name_ar: "",
    name_en: "",
    country_id: 1,
  },
  codeImage: "",
  whatsappPreferred: false,
  featured: false,
  latitude: "",
  longitude: "",
};

export const advertisementSlice = createSlice({
  name: "advertisement",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },

    setIso_code: (state, action: PayloadAction<string>) => {
      state.iso_code = action.payload;
    },

    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },

    setCountry: (state, action: PayloadAction<countryType>) => {
      state.country = action.payload;
    },

    setCity: (state, action: PayloadAction<cityType>) => {
      state.city = action.payload;
    },

    setCodeImages: (state, action: PayloadAction<string>) => {
      state.codeImage = action.payload;
    },

    setWhatsappPreferred: (state, action: PayloadAction<boolean>) => {
      state.whatsappPreferred = action.payload;
    },

    setFeatured: (state, action: PayloadAction<boolean>) => {
      state.featured = action.payload;
    },

    setLatitude: (state, action: PayloadAction<string | number>) => {
      state.latitude = action.payload;
    },

    setLongitude: (state, action: PayloadAction<string | number>) => {
      state.longitude = action.payload;
    },
  },
});

export const {
  setName,
  setPhone,
  setIso_code,
  setAddress,
  setCountry,
  setCity,
  setCodeImages,
  setFeatured,
  setWhatsappPreferred,
  setLatitude,
  setLongitude,
} = advertisementSlice.actions;
export const selectAdvertisement = (state: RootState) => state.advertisement;

export default advertisementSlice.reducer;
