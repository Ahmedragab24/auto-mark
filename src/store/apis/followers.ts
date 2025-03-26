import { getUserData } from "@/utils/userToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const FollowersApi = createApi({
  reducerPath: "FollowersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Followers"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Store Followers
    StoreFollowers: builder.mutation({
      query: (id: number) => ({
        url: `api/followers/add?showroom_id=${id}`,
        method: "POST",
      }),
    }),

    // Github Followers
    GitFollowers: builder.query({
      query: (id: number) => `api/showrooms-follower/${id}`,
    }),
  }),
});

// Export hooks for usage in function components
export const { useStoreFollowersMutation, useGitFollowersQuery } = FollowersApi;
