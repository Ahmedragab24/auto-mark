import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const faqsApi = createApi({
  reducerPath: "faqsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["Faqs"],

  endpoints: (builder) => ({
    //   Get Faqs
    getFaqs: builder.query({
      query: () => `api/faqs`,

      // Provide tags for cache invalidation
      providesTags: ["Faqs"],
    }),
  }),
});

// Export hooks for usage in function components
export const { useGetFaqsQuery } = faqsApi;
