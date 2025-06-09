import { langType, MoreProductType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SearchApi = createApi({
  reducerPath: "SearchApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["SearchByKeywords", "SearchByCategory"],

  keepUnusedDataFor: 0,

  endpoints: (builder) => ({
    //   Get Product By Keywords
    getSearchByKeywords: builder.query({
      query: ({
        keyword,
        page,
        countryID,
        lang,
        categoryID,
        more_type,
      }: {
        keyword: string;
        page: number;
        countryID: number;
        lang: langType;
        categoryID: number;
        more_type: MoreProductType;
      }) =>
        `api/search-product?keyword=${keyword}&page=${page}&country_id=${countryID}&lang=${lang}&more_type=${more_type}&category_id=${categoryID}`,
      providesTags: ["SearchByKeywords"],
    }),

    //   Get Product By Brand
    getSearchByBrand: builder.query({
      query: ({
        keyword,
        categoryID,
      }: {
        keyword: string;
        categoryID: number;
      }) =>
        `api/search-text/products?keyword=${keyword}&category_id=${categoryID}`,
      providesTags: ["SearchByKeywords"],
    }),
  }),
});

export const { useGetSearchByKeywordsQuery, useGetSearchByBrandQuery } =
  SearchApi;
