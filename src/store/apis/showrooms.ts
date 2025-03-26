import type { langType } from "@/types";
import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const ShowroomProductsApi = createApi({
  reducerPath: "ShowroomProductsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: [
    "ShowroomsProducts",
    "ShowroomsProductsById",
    "ShowroomsFollowers",
  ],

  // Reduce cache time to ensure fresh data
  keepUnusedDataFor: 0, // Set to 0 to disable caching

  endpoints: (builder) => ({
    //   Get Showrooms Products
    getShowroomsProducts: builder.query({
      query: ({
        lang,
        page,
        countryId,
        categoryId,
        cityId,
      }: {
        lang: string;
        page: number;
        countryId: number;
        categoryId: number;
        cityId?: number; // Make cityId optional
      }) => {
        // Build the URL dynamically based on whether cityId is provided
        let url = `api/showrooms?page=${page}&country_id=${countryId}&lang=${lang}&category_id=${categoryId}`;

        // Only append cityId to the URL if it exists
        if (cityId !== undefined) {
          url += `&city_id=${cityId}`;
        }

        return { url };
      },

      // Add cache invalidation when country changes
      providesTags: (result, error, arg) => [
        { type: "ShowroomsProducts", id: arg.countryId },
        { type: "ShowroomsProducts", id: "LIST" },
      ],
    }),

    //   Get Showrooms Products BY ID
    getShowroomProductsById: builder.query({
      query: ({ id, lang }: { id: number; lang: langType }) =>
        `api/showrooms/${id}/profile?lang=${lang}`,

      // Provide tags for cache invalidation
      providesTags: ["ShowroomsProductsById"],
    }),

    //   Get Showrooms Followers
    getShowroomFollowers: builder.query({
      query: (id: number) => ({
        url: `api/showrooms-follower/${id}`,
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        header: {
          contentType: "application/json",
          Accept: "application/json",
        },
      }),

      // Provide tags for cache invalidation
      providesTags: ["ShowroomsFollowers"],
    }),

    //   Verification Request
    VerificationRequest: builder.query({
      query: () => ({
        url: `api/showrooms/request/auth`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    }),
  }),
});

// Export hooks for usage in function components
export const {
  useGetShowroomsProductsQuery,
  useGetShowroomProductsByIdQuery,
  useGetShowroomFollowersQuery,
  useLazyVerificationRequestQuery,
} = ShowroomProductsApi;
