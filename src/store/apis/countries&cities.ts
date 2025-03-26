import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["countries", "cities"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Get Home Products
    getCountries: builder.query({
      query: () => `api/countries`,

      // Provide tags for cache invalidation
      providesTags: ["countries"],
    }),

    //   Get Category Products
    getCities: builder.query({
      query: ({ countryID }: { countryID: number | null }) =>
        `api/countries/1/states?country_id=${countryID}`,

      // Provide tags for caching and invalidation
      providesTags: ["cities"],
    }),
  }),
});

// Export hooks for usage in function components
export const { useGetCountriesQuery, useGetCitiesQuery } = countriesApi;
