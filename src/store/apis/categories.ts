import { langType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["Categories", "CategoriesByCars"],

  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Get Categories
    getCategories: builder.query({
      query: () => `api/new-categories`,
      providesTags: ["Categories"],
    }),

    //   Get Categories By Cars
    getCategoriesByCars: builder.query({
      query: (lang: langType) =>
        `api/categories/with/subcategories?lang=${lang}`,
      providesTags: ["CategoriesByCars"],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoriesByCarsQuery } =
  categoriesApi;
