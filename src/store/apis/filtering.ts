import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { langType, MoreProductType } from "@/types";

export const filteringApi = createApi({
  reducerPath: "filteringApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["filtering"],
  endpoints: (builder) => ({
    getFilters: builder.query({
      query: ({ id }: { id: number }) => `api/categories/${id}/attributes`,
      providesTags: ["filtering"],
    }),
    getFiltersByKeyword: builder.query({
      query: ({
        page,
        lang,
        countryID,
        categoryID,
        more_type,
        keyword,
      }: {
        page: number;
        lang: langType;
        countryID: number;
        categoryID: number;
        more_type: MoreProductType;
        keyword: string;
      }) =>
        `api/search-product?keyword=${keyword}&page=${page}&country_id=${countryID}&lang=${lang}&more_type=${more_type}&category_id=${categoryID}`,
      providesTags: ["filtering"],
    }),

    advancedSearch: builder.mutation({
      query: ({
        formData,
        lang,
        page,
      }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData: any;
        lang: langType;
        page: number;
      }) => ({
        url: `api/products/filtterAdvaced?lang=${lang}&page=${page}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetFiltersQuery,
  useGetFiltersByKeywordQuery,
  useAdvancedSearchMutation,
} = filteringApi;
