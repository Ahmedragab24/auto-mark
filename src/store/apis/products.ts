import { langType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const ProductsApi = createApi({
  reducerPath: "ProductsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["HomeProducts", "CategoryProducts", "ProductsById"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 3,

  endpoints: (builder) => ({
    //   Get Home Products
    getHomeProducts: builder.query({
      query: ({
        lang,
        countryId,
        page,
      }: {
        lang: langType;
        countryId: number;
        page?: number;
      }) =>
        `api/products/home?lang=${lang}&country_id=${countryId}&page=${page}`,

      // Provide tags for cache invalidation
      providesTags: ["HomeProducts"],
    }),

    //   Get Category Products
    getCategoryProducts: builder.query({
      query: ({
        page,
        countryId,
        categoryId,
        lang,
      }: {
        page: number;
        countryId: number;
        categoryId: number;
        lang: langType;
      }) =>
        `api/categories/${categoryId}/products?page=${page}&country_id=${countryId}&lang=${lang}`,

      // Provide tags for caching and invalidation
      providesTags: ["CategoryProducts"],
    }),

    //   Get  Products by ID
    getProductsById: builder.query({
      query: ({ id, lang }: { id: number; lang: langType }) =>
        `api/product/${id}?lang=${lang}`,

      // Provide tags for caching and invalidation
      providesTags: ["ProductsById"],
    }),
  }),
});

// Export hooks for usage in function components
export const {
  useGetHomeProductsQuery,
  useGetCategoryProductsQuery,
  useGetProductsByIdQuery,
} = ProductsApi;
