import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterOption {
  id: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  value?: string;
}

interface FilterState {
  selectedFilters: {
    [key: string]: FilterOption[];
  };
  text: string;
  number: number | null;
  priceRange: [number, number] | null;
}

const initialState: FilterState = {
  selectedFilters: {},
  text: "",
  number: null,
  priceRange: null,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleFilter: (
      state,
      action: PayloadAction<{ category: string; option: FilterOption }>
    ) => {
      const { category, option } = action.payload;
      if (!state.selectedFilters[category]) {
        state.selectedFilters[category] = [];
      }
      const index = state.selectedFilters[category].findIndex(
        (item) => item.id === option.id
      );
      if (index > -1) {
        state.selectedFilters[category].splice(index, 1);
      } else {
        state.selectedFilters[category].push(option);
      }
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setNumber: (state, action: PayloadAction<number | null>) => {
      state.number = action.payload;
    },
    clearFilters: (state) => {
      state.selectedFilters = {};
      state.priceRange = null;
    },
    setSingleFilter: (
      state,
      action: PayloadAction<{ category: string; option: FilterOption }>
    ) => {
      const { category, option } = action.payload;
      if (state.selectedFilters[category]?.[0]?.id === option.id) {
        state.selectedFilters[category] = [];
      } else {
        state.selectedFilters[category] = [option];
      }
    },
  },
});

export const {
  toggleFilter,
  setPriceRange,
  setText,
  setNumber,
  clearFilters,
  setSingleFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
