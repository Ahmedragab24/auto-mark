import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUserData } from "@/utils/userToken";

// Function to safely get user data
const token = getUserData()?.token;

// Define a service using a base URL and expected endpoints
export const FavoriteApi = createApi({
  reducerPath: "FavoriteApi",
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
  tagTypes: ["Favorites"],

  // Cache settings: Keep data for 60 seconds
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    //   Store Favorite
    StoreFavorite: builder.mutation<void, number>({
      query: (productID) => ({
        url: `api/favorites/add/${productID}`,
        method: "POST",
      }),
    }),

    //   Delete Favorite
    DeleteFavorite: builder.mutation<void, number>({
      query: (productID) => ({
        url: `api/favorites/remove/${productID}`,
        method: "DELETE",
      }),
    }),

    // Get Favorites
    getFavorites: builder.query({
      query: () => `api/favorites/index`,
      providesTags: ["Favorites"],
    }),
  }),
});

// Export hooks for usage in function components
export const {
  useStoreFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} = FavoriteApi;
