import { ColorDirType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attributesApi = createApi({
  reducerPath: "attributesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: [
    "Brands",
    "Models",
    "Colors",
    "SuSections",
    "AutoPartsTypes",
    "AutoPartsTypesCategories",
  ],

  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Get Brands
    getBrands: builder.query({
      query: ({ id }: { id: number }) => `api/brands?category_id=${id}`,
      providesTags: ["Brands"],
    }),

    //   Get Models
    getModels: builder.query({
      query: ({ brand_id }: { brand_id: number }) =>
        `api/brands/${brand_id}/models`,
      providesTags: ["Models"],
    }),

    //   Get Colors
    getColors: builder.query({
      query: ({ ColorDir }: { ColorDir: ColorDirType }) =>
        `api/colors?type=${ColorDir}`,
      providesTags: ["Colors"],
    }),

    // Get SuSections
    getSuSections: builder.query({
      query: ({ categoryID, lang }: { categoryID: number; lang: string }) =>
        `api/categories/${categoryID}/subcategories?lang=${lang}`,
      providesTags: ["SuSections"],
    }),

    // Get auto-parts-types
    getAutoPartsTypes: builder.query({
      query: () => `api/auto-parts-types`,
      providesTags: ["AutoPartsTypes"],
    }),

    // Get auto-parts-types categories
    getAutoPartsTypesCategories: builder.query({
      query: (typeID: number | null) =>
        `api/auto-parts-types/${typeID}/categories`,
      providesTags: ["AutoPartsTypesCategories"], //
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetModelsQuery,
  useGetColorsQuery,
  useGetSuSectionsQuery,
  useGetAutoPartsTypesQuery,
  useGetAutoPartsTypesCategoriesQuery,
} = attributesApi;
