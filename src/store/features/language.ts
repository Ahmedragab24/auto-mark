import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface LanguageState {
  language: "ar" | "en";
}

const getInitialLanguage = (): "ar" | "en" => {
  if (typeof window !== "undefined") {
    const storedLang = localStorage.getItem("lang");
    return storedLang === "ar" || storedLang === "en" ? storedLang : "ar";
  }
  return "ar";
};

const initialState: LanguageState = {
  language: getInitialLanguage(),
};

export const LanguageSlice = createSlice({
  name: "Language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"ar" | "en">) => {
      state.language = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("lang", action.payload);
      }
    },
  },
});

export const { setLanguage } = LanguageSlice.actions;

export const selectLanguage = (state: RootState) => state.Language.language;

export default LanguageSlice.reducer;
